import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Conversation, Message, Widget, Intent, TriageResult } from '../lib/types';
import IntentPill from '../components/IntentPill';

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ConversationDetail() {
  const { id } = useParams();
  const [convo, setConvo] = useState<Conversation | null>(null);
  const [widget, setWidget] = useState<Widget | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const { data: c, error: cErr } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', id)
          .single();
        if (cErr) throw cErr;
        setConvo(c as Conversation);

        const { data: w, error: wErr } = await supabase
          .from('widgets')
          .select('*')
          .eq('id', (c as Conversation).widget_id)
          .single();
        if (wErr) throw wErr;
        setWidget(w as Widget);

        const { data: ms, error: mErr } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', id)
          .order('sent_at', { ascending: true });
        if (mErr) throw mErr;
        const all = (ms ?? []) as Message[];
        // Extract triage row if present
        const triageRow = all.find((m) => m.body.startsWith('__triage__::'));
        if (triageRow) {
          try {
            setTriage(JSON.parse(triageRow.body.replace('__triage__::', '')) as TriageResult);
          } catch {
            /* ignore */
          }
        }
        setMessages(all.filter((m) => !m.body.startsWith('__triage__::')));
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Failed to load.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-text-mute">Loading conversation…</div>;
  if (err || !convo || !widget)
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700">{err ?? 'Conversation not found.'}</div>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        to={`/app/widgets/${widget.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-mute hover:text-text-dark mb-4"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M13 8H3m0 0l4 4m-4-4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to {widget.site_name}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {convo.intent && <IntentPill intent={convo.intent as Intent} />}
            <span className="text-xs text-text-mute">{formatTime(convo.started_at)}</span>
          </div>
          <h1 className="font-display font-extrabold text-text-dark text-2xl tracking-tight">
            {convo.visitor_email}
          </h1>
        </div>
        <div className="text-sm">
          {convo.resolution === 'routed_to_owner' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-neon-cyan/15 to-neon-magenta/15 text-text-dark text-xs font-medium ring-1 ring-neon-magenta/30">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M2 4l6 4 6-4M2 4v8h12V4M2 4l6 4 6-4" stroke="#9D5CE3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Routed to {convo.routed_to}
            </div>
          )}
          {convo.resolution === 'auto_replied' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-mint/15 text-emerald-700 text-xs font-medium ring-1 ring-emerald-300/50">
              Auto-handled by Frame
            </div>
          )}
          {convo.resolution === 'archived' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-light-200 text-text-mute text-xs font-medium">
              Archived
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        {/* transcript */}
        <div className="rounded-2xl bg-white border border-light-200 shadow-card-light p-6">
          <div className="text-xs font-mono font-semibold text-text-dark tracking-wide uppercase mb-4">
            Transcript
          </div>
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'visitor' ? 'justify-start' : 'justify-end'}`}
              >
                <div className="max-w-[78%]">
                  <div
                    className={`text-[10px] font-mono uppercase tracking-wider mb-1 ${
                      m.sender === 'visitor' ? 'text-text-mute' : 'text-neon-magenta'
                    }`}
                  >
                    {m.sender === 'visitor' ? convo.visitor_email : m.sender === 'frame' ? 'Frame' : 'Owner'}
                  </div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.sender === 'visitor'
                        ? 'bg-light-100 text-text-dark rounded-tl-md'
                        : 'bg-gradient-to-br from-neon-purple to-neon-magenta text-white rounded-tr-md shadow-glow-purple'
                    }`}
                  >
                    {m.body}
                  </div>
                  <div className="text-[10px] text-text-mute mt-1 font-mono">{formatTime(m.sent_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* triage reasoning panel */}
        <div className="space-y-5">
          {triage && (
            <div className="rounded-2xl bg-ink-700 text-white p-6 shadow-card-dark relative overflow-hidden">
              <div className="absolute inset-0 bg-mesh-purple opacity-50 pointer-events-none" />
              <div className="relative">
                <div className="text-[10px] font-mono tracking-wider text-neon-cyan mb-2 uppercase">
                  Frame's reasoning
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <div className="font-display font-extrabold text-white text-3xl capitalize">
                    {triage.intent.replace('_', ' ')}
                  </div>
                  <div className="font-mono text-[11px] text-white/55">
                    {(triage.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
                <div className="text-sm text-white/80 leading-relaxed mb-4">{triage.reasoning}</div>
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div>
                    <div className="text-[10px] font-mono text-white/45 uppercase mb-1">Visitor summary</div>
                    <div className="text-sm text-white/85">{triage.visitor_summary}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-white/45 uppercase mb-1">Action</div>
                    <div className="text-sm text-white/85">
                      {triage.should_route_to_owner ? 'Routed to owner' : 'Handled by Frame'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white border border-light-200 shadow-card-light p-5">
            <div className="text-xs font-mono font-semibold text-text-dark tracking-wide uppercase mb-3">
              Widget context
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-mute">Site</span>
                <span className="text-text-dark font-medium">{widget.site_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-mute">Embed ID</span>
                <span className="text-text-dark font-mono text-[11px]">{widget.embed_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-mute">Owner email</span>
                <span className="text-text-dark font-mono text-[11px]">{widget.owner_email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
