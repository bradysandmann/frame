import Anthropic from '@anthropic-ai/sdk';

interface Body {
  message: string;
  siteName: string;
  brandVoice: string;
  escalationRules: string;
  history?: { sender: 'visitor' | 'frame' | 'owner'; body: string }[];
}

type Intent = 'lead' | 'support' | 'billing' | 'out_of_scope' | 'spam';

interface TriageResult {
  intent: Intent;
  confidence: number;
  reasoning: string;
  suggested_reply: string;
  should_route_to_owner: boolean;
  visitor_summary: string;
}

// Inline deterministic fallback (mirrors src/lib/triage.ts so the API stays self-contained)
function deterministic(body: Body): { triage: TriageResult; reply: string } {
  const msg = body.message.toLowerCase().trim();
  const words = msg.split(/\s+/).filter(Boolean);
  const spamSignals = [/\bhttps?:\/\/[^\s]+/, /\b(discount|crypto|forex|seo services|backlink)/i, /click here/i, /buy now/i];
  const isAllCaps = body.message.length > 12 && body.message === body.message.toUpperCase();
  const spamScore = spamSignals.filter((r) => r.test(body.message)).length + (isAllCaps ? 1 : 0);

  const leadKeywords = ['quote', 'estimate', 'price', 'cost', 'how much', 'appointment', 'schedule', 'book', 'available',
    'emergency', 'urgent', 'asap', 'today', 'tomorrow', 'storm', 'leak', 'damage', 'insurance claim',
    'wedding', 'elopement', 'engagement', 'check engine', 'cel', 'transmission', 'misfire', 'replace', 'install'];
  const leadHits = leadKeywords.filter((k) => msg.includes(k)).length;
  const billingKeywords = ['invoice', 'refund', 'charge', 'billed', 'receipt', 'subscription'];
  const billingHits = billingKeywords.filter((k) => msg.includes(k)).length;
  const supportKeywords = ['warranty', 'hours', 'open', 'turnaround', 'how long', 'policy', 'guarantee'];
  const supportHits = supportKeywords.filter((k) => msg.includes(k)).length;
  const oosMarkers = ['do you sell', 'do you offer', 'job application', 'are you hiring'];
  const oosHits = oosMarkers.filter((k) => msg.includes(k)).length;

  let intent: Intent = 'support';
  let confidence = 0.6;
  let reasoning = '';
  let shouldRoute = false;

  if (spamScore >= 2) {
    intent = 'spam';
    confidence = 0.95;
    reasoning = 'Multiple spam signals (links + promotional keywords or all-caps).';
  } else if (billingHits > 0) {
    intent = 'billing';
    confidence = Math.min(0.6 + billingHits * 0.12, 0.92);
    reasoning = `Billing keyword(s) detected: ${billingHits} match(es).`;
    shouldRoute = true;
  } else if (leadHits >= 2 || (leadHits === 1 && words.length > 18)) {
    intent = 'lead';
    confidence = Math.min(0.7 + leadHits * 0.07, 0.95);
    reasoning = `Lead signals detected (${leadHits} keywords) with sufficient detail to escalate.`;
    shouldRoute = true;
  } else if (oosHits > 0 && leadHits === 0) {
    intent = 'out_of_scope';
    confidence = 0.75;
    reasoning = 'Visitor asked about something outside the service line.';
  } else if (supportHits > 0) {
    intent = 'support';
    confidence = 0.7 + supportHits * 0.06;
    reasoning = 'General support/info question. Auto-reply.';
  } else {
    intent = 'support';
    confidence = 0.55;
    reasoning = 'No strong signals. Default to support and auto-reply.';
  }

  const reply =
    intent === 'lead'
      ? `Thanks for reaching out to ${body.siteName}. This sounds like exactly what we handle. I am flagging this for the owner now and someone will reach back out within the hour. What is the best way to contact you (phone or email)?`
      : intent === 'billing'
      ? `Got your billing question. Let me get the owner involved so they can pull up your account. What is the best email tied to your account?`
      : intent === 'support'
      ? `Happy to help with that. If you let me know a bit more I can either answer directly or get the owner involved if it is a bigger conversation.`
      : intent === 'out_of_scope'
      ? `We do not offer that specifically. Is there anything else ${body.siteName} can help with?`
      : `Thanks, but this looks like a sales pitch rather than a question for ${body.siteName}. Archiving so the owner inbox stays clean.`;

  return {
    triage: {
      intent,
      confidence: Number(confidence.toFixed(2)),
      reasoning,
      suggested_reply: reply,
      should_route_to_owner: shouldRoute,
      visitor_summary: body.message.slice(0, 140),
    },
    reply,
  };
}

const SYSTEM_PROMPT = `You are Frame, an inbound chat triage agent that sits on a small business's website.

You do two things at once on every incoming visitor message:

1) Triage the visitor's intent into one of: lead, support, billing, out_of_scope, spam.
   - "lead" = the visitor is a real prospective buyer with concrete details (timeline, scope, budget, urgency).
   - "support" = an existing or curious customer asking a question that doesn't need the owner.
   - "billing" = anything about invoices, refunds, charges, account.
   - "out_of_scope" = a service the business does not offer.
   - "spam" = unsolicited promotional, off-topic, link-heavy, or bot-like.

2) Compose a reply in the business's brand voice. If it's a lead per the escalation rules, the reply should warmly capture contact info and tell them the owner will reach out. If it's support, answer directly. If it's spam, dismiss politely.

You must respect the business's escalation rules exactly. Do not invent services or promise things outside the brand voice.

Output STRICT JSON ONLY, no prose around it, in this shape:
{
  "intent": "lead" | "support" | "billing" | "out_of_scope" | "spam",
  "confidence": 0.0-1.0,
  "reasoning": "one sentence on why this intent",
  "suggested_reply": "the full message you would send to the visitor, in brand voice",
  "should_route_to_owner": true | false,
  "visitor_summary": "one sentence summary of who this visitor is and what they need"
}
No em dashes anywhere in your output.`;

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  if (!body.message || !body.siteName) {
    return new Response(JSON.stringify({ error: 'message and siteName required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const fb = deterministic(body);
    return new Response(JSON.stringify({ ...fb, source: 'deterministic', reason: 'no_api_key' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const client = new Anthropic({ apiKey });
    const userPrompt = [
      `Business: ${body.siteName}`,
      '',
      'Brand voice:',
      body.brandVoice,
      '',
      'Escalation rules:',
      body.escalationRules,
      '',
      body.history && body.history.length > 0
        ? `Conversation so far:\n${body.history.map((m) => `${m.sender}: ${m.body}`).join('\n')}\n`
        : '',
      'New visitor message:',
      body.message,
    ]
      .filter(Boolean)
      .join('\n');

    const resp = await client.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = resp.content
      .filter((c): c is { type: 'text'; text: string } => c.type === 'text')
      .map((c) => c.text)
      .join('\n')
      .trim();

    // Strip code fences if Claude wrapped JSON
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const triage = JSON.parse(cleaned) as TriageResult;

    return new Response(
      JSON.stringify({
        triage,
        reply: triage.suggested_reply,
        source: 'claude',
        model: 'claude-3-5-sonnet-latest',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    const fb = deterministic(body);
    const reason =
      e instanceof Error && /credit|balance|429|rate/i.test(e.message)
        ? 'no_credits'
        : e instanceof Error
        ? e.message.slice(0, 80)
        : 'unknown_error';
    return new Response(JSON.stringify({ ...fb, source: 'deterministic', reason }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
