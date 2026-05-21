import type { Intent } from '@/lib/types';

const styles: Record<Intent, { bg: string; text: string; ring: string; label: string }> = {
  lead: {
    bg: 'bg-gradient-to-r from-neon-cyan/15 to-neon-magenta/15',
    text: 'text-text-dark',
    ring: 'ring-1 ring-neon-magenta/30',
    label: 'Lead',
  },
  support: {
    bg: 'bg-neon-mint/15',
    text: 'text-emerald-700',
    ring: 'ring-1 ring-emerald-300/50',
    label: 'Support',
  },
  billing: {
    bg: 'bg-neon-amber/15',
    text: 'text-amber-800',
    ring: 'ring-1 ring-amber-400/40',
    label: 'Billing',
  },
  out_of_scope: {
    bg: 'bg-light-200',
    text: 'text-text-mute',
    ring: 'ring-1 ring-light-200',
    label: 'Out of scope',
  },
  spam: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-1 ring-rose-200',
    label: 'Spam',
  },
};

export default function IntentPill({ intent, small = false }: { intent: Intent; small?: boolean }) {
  const s = styles[intent];
  return (
    <span
      className={`inline-flex items-center font-medium ${s.bg} ${s.text} ${s.ring} ${
        small ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } rounded-full`}
    >
      {s.label}
    </span>
  );
}
