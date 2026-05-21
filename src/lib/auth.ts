import { supabase } from './supabase';
import { SEED_WIDGETS, SEED_CONVERSATIONS } from './seed';

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function signInWithMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/app` },
  });
  return { error };
}

export async function signInWithPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/app` },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

/**
 * If the user has no widgets, seed them.
 * Runs idempotently — checks first.
 */
export async function seedIfEmpty(userId: string) {
  const { data: existing, error } = await supabase
    .from('widgets')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
  if (error) {
    // eslint-disable-next-line no-console
    console.warn('[seed] widget check error', error.message);
    return;
  }
  if (existing && existing.length > 0) return; // already seeded

  // Insert widgets
  const widgetRows = SEED_WIDGETS.map((w) => ({
    user_id: userId,
    site_name: w.site_name,
    site_url: w.site_url,
    brand_voice_md: w.brand_voice_md,
    escalation_rules_md: w.escalation_rules_md,
    owner_email: w.owner_email,
    embed_id: `${w.embed_id}-${userId.slice(0, 6)}`,
  }));
  const { data: widgets, error: wErr } = await supabase
    .from('widgets')
    .insert(widgetRows)
    .select();
  if (wErr || !widgets) {
    // eslint-disable-next-line no-console
    console.error('[seed] widget insert failed', wErr);
    return;
  }

  // Map embed-id prefix -> widget id
  const idxByPrefix = new Map<string, string>();
  for (const w of widgets) {
    const prefix = (w.embed_id as string).split('-').slice(0, -1).join('-');
    idxByPrefix.set(prefix, w.id as string);
  }

  // Insert conversations + messages
  for (const sc of SEED_CONVERSATIONS) {
    const widgetId = idxByPrefix.get(sc.embed_id);
    if (!widgetId) continue;
    const startedAt = new Date(Date.now() - sc.started_minutes_ago * 60 * 1000).toISOString();
    const lastMsg = sc.messages[sc.messages.length - 1];
    const endedAt = new Date(
      Date.now() - sc.started_minutes_ago * 60 * 1000 + lastMsg.offset_seconds * 1000
    ).toISOString();

    const { data: convo, error: cErr } = await supabase
      .from('conversations')
      .insert({
        widget_id: widgetId,
        channel: 'web',
        visitor_email: sc.visitor_email,
        intent: sc.intent,
        routed_to: sc.routed_to,
        resolution: sc.resolution,
        started_at: startedAt,
        ended_at: endedAt,
      })
      .select()
      .single();
    if (cErr || !convo) {
      // eslint-disable-next-line no-console
      console.warn('[seed] convo insert error', cErr);
      continue;
    }

    const messageRows = sc.messages.map((m) => ({
      conversation_id: convo.id,
      sender: m.sender,
      body: m.body,
      sent_at: new Date(
        Date.now() - sc.started_minutes_ago * 60 * 1000 + m.offset_seconds * 1000
      ).toISOString(),
    }));
    const { error: mErr } = await supabase.from('messages').insert(messageRows);
    if (mErr) {
      // eslint-disable-next-line no-console
      console.warn('[seed] messages insert error', mErr);
    }

    // Stash triage reasoning into the conversation's resolution-detail by upserting a stub message
    // (kept on the conversation row itself via a "frame internal" message — visible to user in detail page)
    await supabase.from('messages').insert({
      conversation_id: convo.id,
      sender: 'frame',
      body: `__triage__::${JSON.stringify(sc.triage)}`,
      sent_at: new Date(
        Date.now() - sc.started_minutes_ago * 60 * 1000 + 1000
      ).toISOString(),
    });
  }
}
