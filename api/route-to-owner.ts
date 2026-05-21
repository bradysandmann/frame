interface Body {
  ownerEmail: string;
  siteName: string;
  visitorEmail?: string;
  visitorSummary: string;
  intent: string;
  reasoning: string;
  transcript: { sender: string; body: string }[];
}

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

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return new Response(JSON.stringify({ ok: false, reason: 'no_resend_key', simulated: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const subject = `New ${body.intent.toUpperCase()} on ${body.siteName}: ${body.visitorSummary.slice(0, 80)}`;

  const html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 580px; margin: 0 auto; color: #1B1530;">
    <div style="background: linear-gradient(120deg, #06D4FA 0%, #9D5CE3 50%, #E83E8C 100%); padding: 20px 24px; border-radius: 12px 12px 0 0;">
      <div style="color: white; font-weight: 800; font-size: 18px;">Frame</div>
      <div style="color: rgba(255,255,255,0.85); font-size: 14px;">New ${body.intent} on ${body.siteName}</div>
    </div>
    <div style="padding: 24px; background: #FAFAFA; border: 1px solid #E8E4EE; border-top: 0; border-radius: 0 0 12px 12px;">
      <p style="margin: 0 0 16px 0; font-size: 16px;"><strong>Visitor:</strong> ${body.visitorEmail || 'no email shared'}</p>
      <p style="margin: 0 0 16px 0; font-size: 16px;"><strong>What they want:</strong> ${body.visitorSummary}</p>
      <p style="margin: 0 0 16px 0; font-size: 14px; color: #6B6480;"><strong>Why Frame routed this:</strong> ${body.reasoning}</p>
      <hr style="border: 0; border-top: 1px solid #E8E4EE; margin: 20px 0;" />
      <div style="font-size: 13px; color: #6B6480; margin-bottom: 8px;">Transcript</div>
      ${body.transcript
        .map(
          (m) =>
            `<div style="margin-bottom: 12px;"><strong style="color:${m.sender === 'visitor' ? '#9D5CE3' : '#06D4FA'};">${m.sender}:</strong> <span>${m.body}</span></div>`
        )
        .join('')}
    </div>
    <div style="text-align: center; padding: 16px; font-size: 12px; color: #6B6480;">
      Sent by Frame
    </div>
  </div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Frame <onboarding@resend.dev>',
        to: [body.ownerEmail],
        subject,
        html,
      }),
    });
    const j = await r.json();
    if (!r.ok) {
      return new Response(JSON.stringify({ ok: false, reason: 'resend_error', detail: j }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: true, id: j.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, reason: 'network_error', detail: String(e) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
