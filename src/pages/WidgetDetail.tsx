import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Widget, Conversation, Intent } from '../lib/types';
import IntentPill from '../components/IntentPill';

function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function WidgetDetail() {
  const { id } = useParams();
  const [widget, setWidget] = useState<Widget | null>(null);
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [busy, setBusy] = useState(false);
  const [voice, setVoice] = useState('');
  const [rules, setRules] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [siteName, setSiteName] = useState('');
  const [snippetCopied, setSnippetCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const { data: w, error: wErr } = await supabase
          .from('widgets')
          .select('*')
          .eq('id', id)
          .single();
        if (wErr) throw wErr;
        setWidget(w as Widget);
        setVoice((w as Widget).brand_voice_md ?? '');
        setRules((w as Widget).escalation_rules_md ?? '');
        setOwnerEmail((w as Widget).owner_email ?? '');
        setSiteName((w as Widget).site_name ?? '');
        const { data: cs, error: cErr } = await supabase
          .from('conversations')
          .select('*')
          .eq('widget_id', id)
          .order('started_at', { ascending: false });
        if (cErr) throw cErr;
        setConvos((cs ?? []) as Conversation[]);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Failed to load.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function save() {
    if (!widget) return;
    setBusy(true);
    setSaved(false);
    try {
      const { error } = await supabase
        .from('widgets')
        .update({
          brand_voice_md: voice,
          escalation_rules_md: rules,
          owner_email: ownerEmail,
          site_name: siteName,
        })
        .eq('id', widget.id);
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  }

  const snippet =
    widget &&
    `<script
  src="https://frame.app/widget.js"
  data-frame-id="${widget.embed_id}"
  defer
></script>`;

  async function copySnippet() {
    if (!snippet) return;
    await navigator.clipboard.writeText(snippet);
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 1800);
  }

  if (loading) return <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-text-mute">Loading widget…</div>;
  if (err || !widget)
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700">{err ?? 'Widget not found.'}</div>
        <Link to="/app" className="inline-block mt-4 text-sm text-neon-purple hover:underline">
          Back to dashboard
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link to="/app" className="inline-flex items-center gap-1.5 text-sm text-text-mute hover:text-text-dark mb-4">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M13 8H3m0 0l4 4m-4-4l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-extrabold tracking-tight text-text-dark text-3xl">
              {widget.site_name}
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-light-100 text-text-mute">
              {widget.embed_id}
            </span>
          </div>
          <div className="text-sm text-text-mute">{widget.site_url}</div>
        </div>
        <Link
          to={`/app/test/${widget.id}`}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-rainbow-animated px-5 py-2.5 text-sm font-semibold text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.99] transition self-start"
        >
          Open test widget
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* config */}
        <div className="space-y-5">
          <Card title="Site name">
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-light-50 border border-light-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-purple/50 transition"
            />
          </Card>

          <Card title="Brand voice" hint="Plain English. How would you describe the way you talk to customers?">
            <textarea
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              rows={5}
              className="w-full bg-light-50 border border-light-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-neon-purple/50 transition leading-relaxed"
              placeholder="Friendly, plain-spoken. Always confirm property type."
            />
          </Card>

          <Card title="Escalation rules" hint="When should Frame route a conversation to you instead of auto-replying?">
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={5}
              className="w-full bg-light-50 border border-light-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-neon-purple/50 transition leading-relaxed"
              placeholder="Route to owner if: …. Auto-reply for: …"
            />
          </Card>

          <Card title="Owner email" hint="Where high-value leads land.">
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="w-full bg-light-50 border border-light-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-purple/50 transition"
            />
          </Card>

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={busy}
              className="rounded-lg bg-text-dark text-white px-5 py-2.5 text-sm font-semibold hover:bg-ink-700 disabled:opacity-60 transition"
            >
              {busy ? 'Saving…' : 'Save changes'}
            </button>
            {saved && <span className="text-sm text-emerald-600 font-medium">Saved.</span>}
          </div>
        </div>

        {/* embed + conversations */}
        <div className="space-y-5">
          <Card title="Embed snippet" hint="Paste before </body> on your site.">
            <pre className="rounded-lg bg-ink-700 text-white/90 text-[12px] font-mono px-3.5 py-3 overflow-x-auto leading-relaxed">
{snippet}
            </pre>
            <button
              onClick={copySnippet}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-neon-purple hover:text-neon-magenta transition"
            >
              {snippetCopied ? 'Copied.' : 'Copy snippet'}
            </button>
          </Card>

          <Card title="Recent conversations" hint={`${convos.length} total`}>
            <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin -mr-2 pr-2">
              {convos.length === 0 && (
                <div className="text-sm text-text-mute italic">No conversations yet.</div>
              )}
              {convos.map((c) => (
                <Link
                  key={c.id}
                  to={`/app/conversations/${c.id}`}
                  className="flex items-center justify-between gap-3 py-2 px-2.5 rounded-lg hover:bg-light-100 transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {c.intent && <IntentPill intent={c.intent as Intent} small />}
                    <div className="text-sm text-text-dark truncate">{c.visitor_email}</div>
                  </div>
                  <div className="text-[11px] text-text-mute whitespace-nowrap font-mono">
                    {formatRelativeTime(c.started_at)}
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-light-200 shadow-card-light p-5">
      <div className="flex items-end justify-between mb-2.5">
        <div className="text-xs font-mono font-semibold text-text-dark tracking-wide uppercase">{title}</div>
        {hint && <div className="text-[11px] text-text-mute text-right max-w-[60%]">{hint}</div>}
      </div>
      {children}
    </div>
  );
}
