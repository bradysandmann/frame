import { useEffect, useState } from 'react';
import Logo from './Logo';

interface MockMessage {
  sender: 'visitor' | 'frame';
  body: string;
  delay: number;
}

const SCRIPTS: MockMessage[][] = [
  [
    { sender: 'visitor', body: "Hey, we've got a leak in the dining room ceiling after Sunday's storm.", delay: 800 },
    { sender: 'frame', body: 'Storm damage on the roof — I am flagging this for the owner now. Single-family or townhome? Best phone?', delay: 1600 },
    { sender: 'visitor', body: 'Single-family, South Tampa. 813-555-0144.', delay: 1100 },
    { sender: 'frame', body: 'Got it. Owner will call within the hour to schedule a free inspection.', delay: 1400 },
  ],
  [
    { sender: 'visitor', body: 'Getting married Sept 14 at Mt. Hood. Need ceremony + a first-look at Trillium Lake.', delay: 900 },
    { sender: 'frame', body: 'That sounds beautiful. Specific date plus destination is owner-call territory.', delay: 1700 },
    { sender: 'visitor', body: 'Yes please reach out. sarah.h@protonmail.com', delay: 1100 },
    { sender: 'frame', body: 'Passing this along. She will follow up about the free 20-min consult today.', delay: 1500 },
  ],
];

export default function ChatMockup() {
  const [scriptIdx, setScriptIdx] = useState(0);
  const [shown, setShown] = useState<MockMessage[]>([]);

  useEffect(() => {
    const script = SCRIPTS[scriptIdx];
    setShown([]);
    let cancelled = false;
    let total = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < script.length; i++) {
      total += script[i].delay;
      timers.push(
        setTimeout(() => {
          if (!cancelled) setShown((prev) => [...prev, script[i]]);
        }, total)
      );
    }
    const cycle = setTimeout(() => {
      if (!cancelled) setScriptIdx((s) => (s + 1) % SCRIPTS.length);
    }, total + 3500);
    return () => {
      cancelled = true;
      for (const t of timers) clearTimeout(t);
      clearTimeout(cycle);
    };
  }, [scriptIdx]);

  return (
    <div
      className="relative w-full max-w-sm rounded-2xl bg-ink-700/80 backdrop-blur-xl shadow-card-dark p-1 border-gradient"
      style={{ background: 'linear-gradient(180deg, rgba(36,19,56,0.85), rgba(13,5,24,0.95))' }}
    >
      <div className="bg-ink-700/95 rounded-[14px] overflow-hidden">
        {/* widget header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Logo size={26} />
            <div>
              <div className="text-white text-sm font-semibold">Tampa Roofing Co</div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                <span>Triaging</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/40 font-mono tracking-wider">FRAME</div>
        </div>

        {/* messages */}
        <div className="px-4 py-4 space-y-3 min-h-[280px] max-h-[280px] overflow-hidden">
          {shown.map((m, i) => (
            <div
              key={i}
              className={`flex chat-fade-in ${m.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed ${
                  m.sender === 'visitor'
                    ? 'bg-white/[0.06] text-white/90 rounded-br-md'
                    : 'bg-gradient-rainbow text-white rounded-bl-md shadow-glow-purple'
                }`}
              >
                {m.body}
              </div>
            </div>
          ))}
        </div>

        {/* input mockup */}
        <div className="px-4 py-3 border-t border-white/5 flex items-center gap-2">
          <input
            disabled
            placeholder="Reply…"
            className="flex-1 bg-white/[0.04] text-white/60 placeholder-white/30 rounded-lg px-3 py-2 text-[13px] focus:outline-none"
          />
          <button
            disabled
            className="w-8 h-8 rounded-lg bg-gradient-rainbow flex items-center justify-center"
            aria-label="Send"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L14 2L8 14L6.5 9.5L2 8Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
