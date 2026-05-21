import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { deterministicTriage, deterministicReply } from '../lib/triage';
import type { Intent, TriageResult } from '../lib/types';
import Logo from './Logo';

const PRESETS = [
  { label: 'Storm leak', text: "Hey, we've got a leak in the dining room ceiling after Sunday's storm. South Tampa, 813-555-0144." },
  { label: 'Quote', text: 'Need a quote on a full roof replacement, 2200 sqft ranch. Insurance claim. Schedule this week.' },
  { label: 'Hours', text: 'What are your hours this week?' },
  { label: 'Refund', text: 'I was charged twice for invoice 4421. Need a refund.' },
  { label: 'Spam', text: 'BUY DISCOUNT SEO BACKLINKS NOW https://example.com click here earn $5000' },
];

const INTENTS: { id: Intent; label: string; gradient: string; description: string }[] = [
  { id: 'lead', label: 'Lead', gradient: 'from-cyan-400 via-purple-400 to-pink-400', description: 'Routes to owner immediately' },
  { id: 'support', label: 'Support', gradient: 'from-emerald-400 to-teal-300', description: 'Auto-reply in brand voice' },
  { id: 'billing', label: 'Billing', gradient: 'from-amber-400 to-yellow-300', description: 'Routes with context attached' },
  { id: 'out_of_scope', label: 'Out of scope', gradient: 'from-slate-300 to-slate-200', description: 'Redirected politely' },
  { id: 'spam', label: 'Spam', gradient: 'from-rose-400 to-pink-300', description: 'Archived silently' },
];

const SITE_CONTEXT = {
  brandVoice: 'friendly, plain-spoken, South Tampa roofing co. No upselling.',
  escalationRules: 'storm damage, insurance claims, leaks always route',
  siteName: 'Tampa Roofing Co',
};

type Phase = 'idle' | 'thinking' | 'classified';

export default function LiveDemo() {
  const [text, setText] = useState(PRESETS[0].text);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<TriageResult | null>(null);
  const [autoReply, setAutoReply] = useState<string>('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function runTriage(t = text) {
    if (!t.trim()) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('thinking');
    setResult(null);
    setAutoReply('');
    timerRef.current = setTimeout(() => {
      const r = deterministicTriage(t, SITE_CONTEXT);
      setResult(r);
      setAutoReply(deterministicReply(r, SITE_CONTEXT));
      setPhase('classified');
    }, 850);
  }

  function pickPreset(p: typeof PRESETS[number]) {
    setText(p.text);
    setTimeout(() => runTriage(p.text), 80);
  }

  return (
    <div
      className="relative w-full max-w-md rounded-2xl shadow-card-dark p-[1px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(6,212,250,0.55), rgba(157,92,227,0.55), rgba(232,62,140,0.55))',
      }}
    >
      <div className="rounded-[15px] bg-ink-700/95 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Logo size={22} />
            <div>
              <div className="text-white text-[13px] font-semibold leading-tight">Try the classifier</div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/45 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                <span>Live, in your browser</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/40 font-mono tracking-wider">DEMO</div>
        </div>

        {/* Input */}
        <div className="px-5 pt-4 pb-3">
          <label className="text-[10px] font-mono text-white/40 tracking-wider mb-2 block">
            VISITOR MESSAGE
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') runTriage();
            }}
            rows={3}
            placeholder="Type a message a buyer might send..."
            className="w-full bg-white/[0.04] border border-white/10 text-white/90 placeholder-white/30 rounded-lg px-3 py-2.5 text-[13px] leading-snug resize-none focus:outline-none focus:border-neon-cyan/40 transition"
          />
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => pickPreset(p)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => runTriage()}
            disabled={phase === 'thinking'}
            className="mt-3 w-full rounded-lg bg-gradient-rainbow-animated text-white text-[13px] font-semibold py-2.5 shadow-glow-purple hover:scale-[1.005] active:scale-[0.99] transition disabled:opacity-60 disabled:hover:scale-100"
          >
            {phase === 'thinking' ? 'Classifying...' : 'Run triage'}
          </button>
        </div>

        {/* Results area */}
        <div className="px-5 pb-5 pt-1">
          <label className="text-[10px] font-mono text-white/40 tracking-wider mb-2 block">
            CLASSIFICATION
          </label>

          {/* Category badges */}
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {INTENTS.map((intent, idx) => {
              const isActive = result?.intent === intent.id && phase === 'classified';
              const isThinking = phase === 'thinking';
              return (
                <motion.div
                  key={intent.id}
                  animate={
                    isThinking
                      ? { opacity: [0.35, 1, 0.35] }
                      : isActive
                      ? { scale: [1, 1.06, 1], opacity: 1 }
                      : { scale: 1, opacity: phase === 'classified' ? 0.35 : 0.55 }
                  }
                  transition={
                    isThinking
                      ? { duration: 1.2, repeat: Infinity, delay: idx * 0.1 }
                      : { duration: 0.45 }
                  }
                  className="relative"
                >
                  <div
                    className={`relative aspect-square rounded-lg border ${
                      isActive ? 'border-white/30' : 'border-white/10'
                    } overflow-hidden flex flex-col items-center justify-center p-1`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${intent.gradient} ${
                        isActive ? 'opacity-90' : 'opacity-30'
                      } transition-opacity duration-300`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="activeGlow"
                        className="absolute inset-0 ring-1 ring-white/40 rounded-lg"
                        initial={false}
                      />
                    )}
                    <div className="relative text-white text-[9px] font-mono font-bold uppercase tracking-tight leading-none text-center">
                      {intent.label.split(' ')[0]}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Thinking dots */}
          <AnimatePresence mode="wait">
            {phase === 'thinking' && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-2 text-white/55 text-[12px] py-3"
              >
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
                    />
                  ))}
                </span>
                <span className="font-mono">Reading visitor intent...</span>
              </motion.div>
            )}

            {phase === 'classified' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-2.5"
              >
                {/* Verdict row */}
                <div className="flex items-center justify-between rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        result.should_route_to_owner ? 'bg-neon-magenta' : 'bg-emerald-400'
                      } animate-pulse-soft`}
                    />
                    <span className="text-white text-[13px] font-semibold">
                      {INTENTS.find((i) => i.id === result.intent)?.label}
                    </span>
                    <span className="text-white/40 text-[11px] font-mono">
                      {Math.round(result.confidence * 100)}% confident
                    </span>
                  </div>
                  <div
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      result.should_route_to_owner
                        ? 'bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/30'
                        : 'bg-emerald-400/10 text-emerald-300 border border-emerald-300/20'
                    }`}
                  >
                    {result.should_route_to_owner ? 'ROUTE' : 'AUTO-REPLY'}
                  </div>
                </div>

                {/* Reasoning */}
                <div className="text-[11.5px] text-white/55 leading-snug px-1">
                  <span className="font-mono text-white/35">Why: </span>
                  {result.reasoning}
                </div>

                {/* Conditional preview */}
                {result.should_route_to_owner ? (
                  <RouteToOwnerPreview result={result} message={text} />
                ) : (
                  <AutoReplyPreview reply={autoReply} />
                )}
              </motion.div>
            )}

            {phase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/40 text-[12px] text-center py-4 font-mono"
              >
                Pick a preset or type your own
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RouteToOwnerPreview({ result, message }: { result: TriageResult; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-lg bg-white border border-white/10 overflow-hidden text-text-dark"
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-light-100 border-b border-light-200 text-[11px] text-text-mute font-mono">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M2 4l6 5 6-5M2 4v8a1 1 0 001 1h10a1 1 0 001-1V4M2 4h12" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
        <span>To: owner@tamparoofingco.com</span>
        <span className="ml-auto text-text-mute/60">just now</span>
      </div>
      <div className="px-3 py-2.5">
        <div className="text-[12.5px] font-semibold text-text-dark mb-1.5">
          New {result.intent} from your site: {result.visitor_summary.slice(0, 48)}{result.visitor_summary.length > 48 ? '...' : ''}
        </div>
        <div className="text-[11.5px] text-text-mute leading-snug mb-2">
          <span className="text-text-dark/80 font-medium">Frame says: </span>
          {result.reasoning}
        </div>
        <div className="rounded bg-light-100 border border-light-200 px-2.5 py-1.5 text-[11px] text-text-dark/80 font-mono leading-snug">
          "{message.slice(0, 110)}{message.length > 110 ? '...' : ''}"
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-white bg-text-dark px-2 py-1 rounded">
            Claim this lead
          </span>
          <span className="text-[10.5px] text-text-mute">pauses auto-replier</span>
        </div>
      </div>
    </motion.div>
  );
}

function AutoReplyPreview({ reply }: { reply: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5"
    >
      <div className="text-[10px] font-mono text-white/40 tracking-wider mb-1.5">
        AUTO-REPLY (BRAND VOICE)
      </div>
      <div className="text-[12px] text-white/80 leading-snug">{reply}</div>
    </motion.div>
  );
}
