import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { triageMessage } from '../lib/claude';
import type { Widget, Intent, TriageResult } from '../lib/types';
import IntentPill from '../components/IntentPill';
import Logo from '../components/Logo';

interface LocalMessage {
  id: string;
  sender: 'visitor' | 'frame';
  body: string;
  ts: number;
  triage?: TriageResult;
  source?: 'claude' | 'deterministic';
  latency_ms?: number;
}

export default function TestWidget() {
  const { id } = useParams();
  const [widget, setWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [convoId, setConvoId] = useState<string | null>(null);
  const [emailingOwner, setEmailingOwner] = useState(false);
  const [emailResult, setEmailResult] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const { data: w, error } = await supabase.from('widgets').select('*').eq('id', id).single();
        if (error) throw error;
        setWidget(w as Widget);
        setMessages([
          {
            id: 'sys-1',
            sender: 'frame',
            body: `Hi! This is the ${(w as Widget).site_name} test widget. Send a message to see Frame triage it in real time.`,
            ts: Date.now(),
          },
        ]);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Failed to load widget.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  async function send() {
    if (!widget || !input.trim() || thinking) return;
    const msg = input.trim();
    setInput('');

    const visitorMsg: LocalMessage = {
      id: `v-${Date.now()}`,
      sender: 'visitor',
      body: msg,
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, visitorMsg]);
    setThinking(true);

    // ensure conversation exists in DB
    let cId = convoId;
    if (!cId) {
      const { data: c } = await supabase
        .from('conversations')
        .insert({
          widget_id: widget.id,
          channel: 'web',
          visitor_email: 'test-widget@frame.local',
          intent: null,
        })
        .select()
        .single();
      cId = c?.id ?? null;
      setConvoId(cId);
    }
    if (cId) {
      await supabase.from('messages').insert({
        conversation_id: cId,
        sender: 'visitor',
        body: msg,
      });
    }

    const history = messages
      .filter((m) => !m.body.startsWith('Hi!'))
      .map((m) => ({ sender: m.sender, body: m.body }));

    const result = await triageMessage({
      message: msg,
      siteName: widget.site_name,
      brandVoice: widget.brand_voice_md ?? '',
      escalationRules: widget.escalation_rules_md ?? '',
      history,
    });

    const frameMsg: LocalMessage = {
      id: `f-${Date.now()}`,
      sender: 'frame',
      body: result.reply,
      ts: Date.now(),
      triage: result.triage,
      source: result.source,
      latency_ms: result.latency_ms,
    };
    setMessages((prev) => [...prev, frameMsg]);
    setThinking(false);

    if (cId) {
      await supabase.from('messages').insert({
        conversation_id: cId,
        sender: 'frame',
        body: result.reply,
      });
      await supabase
        .from('conversations')
        .update({
          intent: result.triage.intent,
          routed_to: result.triage.should_route_to_owner ? widget.owner_email : null,
          resolution:
            result.triage.intent === 'spam'
              ? 'archived'
              : result.triage.should_route_to_owner
              ? 'routed_to_owner'
              : 'auto_replied',
        })
        .eq('id', cId);
    }

    // If high-value, attempt to actually email the owner via /api/route-to-owner
    if (result.triage.should_route_to_owner && widget.owner_email) {
      setEmailingOwner(true);
      setEmailResult(null);
      try {
        const r = await fetch('/api/route-to-owner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ownerEmail: widget.owner_email,
            siteName: widget.site_name,
            visitorEmail: 'test-widget@frame.local',
            visitorSummary: result.triage.visitor_summary,
            intent: result.triage.intent,
            reasoning: result.triage.reasoning,
            transcript: [...history, { sender: 'visitor', body: msg }, { sender: 'frame', body: result.reply }],
          }),
        });
        const j = await r.json();
        if (j.ok) {
          setEmailResult(`Alert sent to ${widget.owner_email}.`);
        } else if (j.reason === 'resend_error') {
          setEmailResult(`Resend rejected (likely sandbox: only the verified Resend account can receive). Owner-routing path is wired.`);
        } else if (j.reason === 'no_resend_key') {
          setEmailResult(`Owner-routing simulated (no Resend key configured).`);
        } else {
          setEmailResult(`Owner-routing path executed (${j.reason ?? 'no key on serverless'}).`);
        }
      } catch {
        setEmailResult('Owner-routing endpoint unreachable in this preview.');
      } finally {
        setEmailingOwner(false);
      }
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  if (loading) return <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-text-mute">Loading test widget…</div>;
  if (err || !widget)
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700">{err ?? 'Widget not found.'}</div>
      </div>
    );

  const lastTriaged = [...messages].reverse().find((m) => m.triage);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to={`/app/widgets/${widget.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-mute hover:text-text-dark mb-4"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M13 8H3m0 0l4 4m-4-4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to {widget.site_name}
      </Link>

      <div className="mb-7">
        <h1 className="font-display font-extrabold text-text-dark text-3xl tracking-tight mb-1">
          Test widget · {widget.site_name}
        </h1>
        <p className="text-sm text-text-mute">
          Send a message below. Frame triages it in real time using the Claude path (with deterministic fallback if no credits).
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* live triage panel */}
        <div className="space-y-5 order-2 lg:order-1">
          <div className="rounded-2xl bg-ink-700 text-white p-6 shadow-card-dark relative overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 bg-mesh-purple opacity-50 pointer-events-none" />
            <div className="relative">
              <div className="text-[10px] font-mono tracking-wider text-neon-cyan mb-2 uppercase">
                Live triage
              </div>
              {!lastTriaged && (
                <div className="text-white/55 text-sm leading-relaxed">
                  Send a message in the widget to see Frame's intent classification, reasoning, confidence, and routing action.
                </div>
              )}
              {lastTriaged && lastTriaged.triage && (
                <>
                  <div className="flex items-baseline gap-2 mb-4">
                    <div className="font-display font-extrabold text-white text-4xl capitalize">
                      {lastTriaged.triage.intent.replace('_', ' ')}
                    </div>
                    <div className="font-mono text-[11px] text-white/55">
                      {(lastTriaged.triage.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                  <div className="text-sm text-white/80 leading-relaxed mb-4">
                    {lastTriaged.triage.reasoning}
                  </div>
                  <div className="border-t border-white/10 pt-4 space-y-3 mb-4">
                    <div>
                      <div className="text-[10px] font-mono text-white/45 uppercase mb-1">Visitor summary</div>
                      <div className="text-sm text-white/85">{lastTriaged.triage.visitor_summary}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/45 uppercase mb-1">Action</div>
                      <div className="text-sm text-white/85">
                        {lastTriaged.triage.should_route_to_owner
                          ? `Routing to ${widget.owner_email}`
                          : 'Auto-handled by Frame'}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
                    <span
                      className={`text-[10px] font-mono px-2 py-1 rounded ${
                        lastTriaged.source === 'claude'
                          ? 'bg-emerald-500/20 text-emerald-200'
                          : 'bg-amber-500/20 text-amber-200'
                      }`}
                    >
                      {lastTriaged.source === 'claude' ? 'CLAUDE PATH' : 'DETERMINISTIC FALLBACK'}
                    </span>
                    {lastTriaged.latency_ms !== undefined && (
                      <span className="text-[10px] font-mono text-white/45">
                        {lastTriaged.latency_ms}ms
                      </span>
                    )}
                    {emailingOwner && (
                      <span className="text-[10px] font-mono text-neon-cyan">Sending owner alert…</span>
                    )}
                    {emailResult && (
                      <span className="text-[11px] text-white/65">{emailResult}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-light-200 shadow-card-light p-5">
            <div className="text-xs font-mono font-semibold text-text-dark tracking-wide uppercase mb-3">
              Try these
            </div>
            <div className="space-y-2 text-sm">
              {EXAMPLE_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setInput(p.body)}
                  className="block w-full text-left px-3 py-2 rounded-lg bg-light-50 hover:bg-light-100 transition"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <IntentPill intent={p.intent} small />
                    <span className="text-xs text-text-mute">{p.label}</span>
                  </div>
                  <div className="text-text-dark">{p.body}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* chat widget */}
        <div className="order-1 lg:order-2">
          <div
            className="rounded-2xl bg-ink-700/95 shadow-card-dark p-1 border-gradient lg:sticky lg:top-20"
          >
            <div className="rounded-[14px] bg-ink-700/95 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <Logo size={26} />
                  <div>
                    <div className="text-white text-sm font-semibold">{widget.site_name}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                      <span>Test mode</span>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-white/40 font-mono tracking-wider">FRAME</div>
              </div>

              <div
                ref={scrollerRef}
                className="px-4 py-4 space-y-3 h-[400px] overflow-y-auto scrollbar-thin"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex chat-fade-in ${m.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed ${
                        m.sender === 'visitor'
                          ? 'bg-white/[0.08] text-white rounded-br-md'
                          : 'bg-gradient-rainbow text-white rounded-bl-md shadow-glow-purple'
                      }`}
                    >
                      {m.body}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-rainbow text-white rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-glow-purple flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '160ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '320ms' }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-white/5 flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  rows={1}
                  placeholder="Send a message…"
                  className="flex-1 bg-white/[0.06] text-white placeholder-white/30 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:bg-white/[0.08] transition resize-none max-h-24 leading-relaxed"
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || thinking}
                  className="w-9 h-9 rounded-lg bg-gradient-rainbow flex items-center justify-center disabled:opacity-40 hover:scale-[1.04] active:scale-[0.96] transition shadow-glow-purple"
                  aria-label="Send"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8L14 2L8 14L6.5 9.5L2 8Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const EXAMPLE_PROMPTS: { label: string; intent: Intent; body: string }[] = [
  { label: 'High-intent lead', intent: 'lead', body: "We have a leak in the dining room ceiling after Sunday's storm. Single family in South Tampa, asphalt shingle, about 14 years old." },
  { label: 'Pricing curiosity', intent: 'support', body: "What's a typical warranty on a new shingle roof?" },
  { label: 'Billing question', intent: 'billing', body: "I think I was charged twice for my invoice last month, can you check?" },
  { label: 'Out of scope', intent: 'out_of_scope', body: "Hey, do you sell used cars?" },
  { label: 'Spam', intent: 'spam', body: "BUY DISCOUNTED SOLAR PANELS NOW! Click https://totallylegit.example" },
];
