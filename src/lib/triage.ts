import type { Intent, TriageResult } from './types';

/**
 * Deterministic triage fallback.
 * Used when no Claude credits are available (default).
 * Same return shape as the Claude path so the rest of the app does not care which fired.
 */
export function deterministicTriage(
  visitorMessage: string,
  context: { brandVoice: string; escalationRules: string; siteName: string }
): TriageResult {
  const msg = visitorMessage.toLowerCase().trim();
  const words = msg.split(/\s+/).filter(Boolean);

  // --- Spam detection ---
  const spamSignals = [
    /\bhttps?:\/\/[^\s]+/,
    /\b(discount|crypto|forex|seo services|backlink|guest post|earn \$)/i,
    /buy now/i,
    /click here/i,
  ];
  const isAllCaps = visitorMessage.length > 12 && visitorMessage === visitorMessage.toUpperCase();
  const spamScore = spamSignals.filter((r) => r.test(visitorMessage)).length + (isAllCaps ? 1 : 0);
  if (spamScore >= 2) {
    return {
      intent: 'spam',
      confidence: 0.95,
      reasoning: 'Multiple spam signals (link + promotional keywords or all-caps).',
      suggested_reply: 'Polite dismissal, archive without routing.',
      should_route_to_owner: false,
      visitor_summary: 'Likely spam / promotional message.',
    };
  }

  // --- Lead signals ---
  const leadKeywords = [
    'quote', 'estimate', 'price', 'cost', 'how much',
    'appointment', 'schedule', 'book', 'available',
    'emergency', 'urgent', 'asap', 'today', 'tomorrow',
    'storm', 'leak', 'damage', 'insurance claim',
    'wedding', 'elopement', 'engagement',
    'check engine', 'cel', 'transmission', 'misfire',
    'replace', 'replacement', 'install',
  ];
  const leadHits = leadKeywords.filter((k) => msg.includes(k)).length;

  // --- Billing signals ---
  const billingKeywords = ['invoice', 'refund', 'charge', 'billed', 'receipt', 'subscription'];
  const billingHits = billingKeywords.filter((k) => msg.includes(k)).length;

  // --- Support signals ---
  const supportKeywords = ['warranty', 'hours', 'open', 'turnaround', 'how long', 'policy', 'guarantee'];
  const supportHits = supportKeywords.filter((k) => msg.includes(k)).length;

  // --- Out-of-scope signals ---
  const outOfScopeMarkers = ['do you sell', 'do you offer', 'job application', 'are you hiring'];
  const oosHits = outOfScopeMarkers.filter((k) => msg.includes(k)).length;

  let intent: Intent = 'support';
  let confidence = 0.6;
  let reasoning = '';
  let shouldRoute = false;

  if (billingHits > 0) {
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
    shouldRoute = false;
  } else if (supportHits > 0) {
    intent = 'support';
    confidence = 0.7 + supportHits * 0.06;
    reasoning = 'General support/info question. Auto-reply.';
    shouldRoute = false;
  } else {
    intent = 'support';
    confidence = 0.55;
    reasoning = 'No strong signals. Default to support and auto-reply.';
    shouldRoute = false;
  }

  // Build a reply that uses the brand voice
  const brandTone = context.brandVoice.split('\n')[0] || `friendly ${context.siteName}`;
  const suggested =
    intent === 'lead'
      ? `Acknowledge in brand voice ("${brandTone.slice(0, 60)}..."), capture contact, route to owner.`
      : intent === 'out_of_scope'
      ? 'Redirect to a real service, do not push, archive on disengage.'
      : 'Answer in brand voice, soft offer of follow-up, do not route.';

  return {
    intent,
    confidence: Number(confidence.toFixed(2)),
    reasoning,
    suggested_reply: suggested,
    should_route_to_owner: shouldRoute,
    visitor_summary: visitorMessage.slice(0, 140),
  };
}

/**
 * Generate a deterministic in-brand reply for the auto-reply path.
 * Used in the live test widget when there is no Claude response.
 */
export function deterministicReply(
  triage: TriageResult,
  context: { siteName: string; brandVoice: string }
): string {
  switch (triage.intent) {
    case 'lead':
      return `Thanks for reaching out to ${context.siteName}. This sounds like exactly what we handle. I am flagging this for the owner now and someone will reach back out within the hour. What is the best way to contact you (phone or email)?`;
    case 'billing':
      return `Got your billing question. Let me get the owner involved so they can pull up your account and resolve this directly. What is the best email tied to your account?`;
    case 'support':
      return `Happy to help with that. If you let me know a bit more (what you are looking at, your timeline) I can either answer directly or get the owner involved if it is a bigger conversation.`;
    case 'out_of_scope':
      return `We do not offer that specifically. Is there anything else ${context.siteName} can help with?`;
    case 'spam':
      return `Thanks, but this looks like a sales pitch rather than a question for ${context.siteName}. Archiving so the owner inbox stays clean.`;
  }
}
