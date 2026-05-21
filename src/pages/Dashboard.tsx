import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Widget, Conversation, Intent } from '../lib/types';
import IntentPill from '../components/IntentPill';

interface WidgetWithStats extends Widget {
  conversations: Conversation[];
}

function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Dashboard() {
  const [widgets, setWidgets] = useState<WidgetWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: ws, error: wErr } = await supabase
          .from('widgets')
          .select('*')
          .order('created_at', { ascending: true });
        if (wErr) throw wErr;
        const widgetIds = (ws ?? []).map((w) => w.id);
        const { data: cs, error: cErr } = await supabase
          .from('conversations')
          .select('*')
          .in('widget_id', widgetIds)
          .order('started_at', { ascending: false });
        if (cErr) throw cErr;
        const merged: WidgetWithStats[] = (ws ?? []).map((w) => ({
          ...(w as Widget),
          conversations: (cs ?? []).filter((c) => c.widget_id === w.id) as Conversation[],
        }));
        setWidgets(merged);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Failed to load.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalConvos = widgets.reduce((sum, w) => sum + w.conversations.length, 0);
  const leadCount = widgets.reduce(
    (sum, w) => sum + w.conversations.filter((c) => c.intent === 'lead').length,
    0
  );
  const routedCount = widgets.reduce(
    (sum, w) => sum + w.conversations.filter((c) => c.resolution === 'routed_to_owner').length,
    0
  );
  const autoCount = widgets.reduce(
    (sum, w) => sum + w.conversations.filter((c) => c.resolution === 'auto_replied').length,
    0
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-text-mute">Loading widgets…</div>
    );
  }

  if (err) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700">{err}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9">
        <div>
          <h1 className="font-display font-extrabold tracking-tight text-text-dark text-4xl">
            Dashboard
          </h1>
          <p className="text-text-mute mt-1">
            {widgets.length} {widgets.length === 1 ? 'widget' : 'widgets'} active, {totalConvos} conversations triaged.
          </p>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total conversations" value={totalConvos} accent="from-neon-cyan to-neon-purple" />
        <StatCard label="Qualified leads" value={leadCount} accent="from-neon-purple to-neon-magenta" />
        <StatCard label="Routed to owner" value={routedCount} accent="from-neon-magenta to-amber-400" />
        <StatCard label="Auto-handled" value={autoCount} accent="from-emerald-400 to-neon-cyan" />
      </div>

      {/* widgets */}
      <div className="grid lg:grid-cols-2 gap-5">
        {widgets.map((w) => (
          <Link
            key={w.id}
            to={`/app/widgets/${w.id}`}
            className="group rounded-2xl bg-white border border-light-200 shadow-card-light p-6 hover:shadow-md hover:border-neon-purple/30 transition"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-text-dark text-lg">{w.site_name}</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-light-100 text-text-mute">
                    {w.embed_id}
                  </span>
                </div>
                <div className="text-xs text-text-mute">{w.site_url}</div>
              </div>
              <div className="text-text-mute group-hover:text-neon-purple transition">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="space-y-2.5">
              {w.conversations.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-3 py-2 border-t border-light-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {c.intent && <IntentPill intent={c.intent as Intent} small />}
                    <div className="text-sm text-text-dark truncate">{c.visitor_email}</div>
                  </div>
                  <div className="text-[11px] text-text-mute whitespace-nowrap font-mono">
                    {formatRelativeTime(c.started_at)}
                  </div>
                </div>
              ))}
              {w.conversations.length === 0 && (
                <div className="text-sm text-text-mute italic">No conversations yet.</div>
              )}
              {w.conversations.length > 3 && (
                <div className="text-xs text-text-mute pt-1">
                  +{w.conversations.length - 3} more
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-light-200 shadow-card-light p-5">
      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${accent} mb-4`} />
      <div className="text-3xl font-display font-extrabold text-text-dark tracking-tight">
        {value}
      </div>
      <div className="text-xs text-text-mute mt-1">{label}</div>
    </div>
  );
}
