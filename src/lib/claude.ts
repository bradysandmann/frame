import type { TriageResult } from './types';
import { deterministicTriage, deterministicReply } from './triage';

interface TriagePayload {
  message: string;
  siteName: string;
  brandVoice: string;
  escalationRules: string;
  history?: { sender: 'visitor' | 'frame' | 'owner'; body: string }[];
}

/**
 * Tries the Claude path via /api/triage. Falls back to deterministic engine
 * on any error (no credits, network issue, anything).
 * Returns { triage, reply, source } so the UI can label which fired.
 */
export async function triageMessage(
  payload: TriagePayload
): Promise<{ triage: TriageResult; reply: string; source: 'claude' | 'deterministic'; latency_ms: number }> {
  const started = Date.now();
  try {
    const res = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`triage api ${res.status}`);
    }
    const data = (await res.json()) as { triage: TriageResult; reply: string; source: 'claude' | 'deterministic' };
    return { ...data, latency_ms: Date.now() - started };
  } catch (e) {
    const triage = deterministicTriage(payload.message, {
      brandVoice: payload.brandVoice,
      escalationRules: payload.escalationRules,
      siteName: payload.siteName,
    });
    const reply = deterministicReply(triage, {
      siteName: payload.siteName,
      brandVoice: payload.brandVoice,
    });
    return {
      triage,
      reply,
      source: 'deterministic',
      latency_ms: Date.now() - started,
    };
  }
}
