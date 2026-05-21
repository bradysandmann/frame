import { motion } from 'framer-motion';

/**
 * Realistic owner-email screenshot showing what an owner gets
 * when Frame routes a high-value lead.
 */
export default function RouteEmailScreenshot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative w-full max-w-md"
    >
      {/* Glow halo */}
      <div className="absolute -inset-6 bg-gradient-to-br from-neon-cyan/15 via-neon-purple/20 to-neon-magenta/15 blur-3xl opacity-70 pointer-events-none" />

      {/* Mail card */}
      <div className="relative rounded-2xl bg-white shadow-2xl overflow-hidden border border-light-200">
        {/* Mail app chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-light-100 border-b border-light-200">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="text-[11px] font-mono text-text-mute">Inbox  -  owner@tamparoofingco.com</div>
          <div className="w-12" />
        </div>

        {/* Email header */}
        <div className="px-5 pt-4 pb-3 border-b border-light-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="text-[15px] font-bold text-text-dark leading-tight">
              New lead from your site: storm damage, South Tampa
            </div>
            <div className="text-[11px] text-text-mute font-mono whitespace-nowrap">9:42 AM</div>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <div className="w-7 h-7 rounded-full bg-gradient-rainbow flex items-center justify-center text-white text-[10px] font-bold">
              F
            </div>
            <div className="flex flex-col">
              <div className="text-text-dark font-semibold leading-tight">Frame</div>
              <div className="text-text-mute text-[11px] leading-tight">notify@frame.app  -  to you</div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 text-text-dark border border-neon-magenta/30">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta" />
                Lead - 94%
              </span>
            </div>
          </div>
        </div>

        {/* Email body */}
        <div className="px-5 py-4 space-y-3">
          <div className="text-[13px] text-text-dark leading-relaxed">
            A visitor on <span className="font-semibold">tamparoofingco.com</span> just sent a high-value message. Here is what Frame heard.
          </div>

          {/* Transcript */}
          <div className="rounded-lg bg-light-100 border border-light-200 p-3.5 space-y-2.5">
            <div className="text-[10px] font-mono text-text-mute tracking-wider">TRANSCRIPT</div>
            <div className="space-y-2">
              <div className="text-[12.5px] text-text-dark">
                <span className="font-semibold">Visitor: </span>
                Hey, we've got a leak in the dining room ceiling after Sunday's storm.
              </div>
              <div className="text-[12.5px] text-text-dark">
                <span className="font-semibold">Frame: </span>
                Storm damage on the roof: I am flagging this for the owner now. Single-family or townhome? Best phone?
              </div>
              <div className="text-[12.5px] text-text-dark">
                <span className="font-semibold">Visitor: </span>
                Single-family, South Tampa. 813-555-0144.
              </div>
            </div>
          </div>

          {/* Frame reasoning */}
          <div className="rounded-lg bg-gradient-to-br from-neon-cyan/5 via-neon-purple/5 to-neon-magenta/5 border border-neon-purple/15 p-3.5">
            <div className="text-[10px] font-mono text-neon-purple tracking-wider mb-1.5">FRAME REASONING</div>
            <div className="text-[12.5px] text-text-dark leading-relaxed">
              Storm-damage keyword plus address plus phone number plus same-week timing. Routes immediately under your escalation rule for storm + leak.
            </div>
          </div>

          {/* Suggested reply */}
          <div className="rounded-lg border border-light-200 p-3.5">
            <div className="text-[10px] font-mono text-text-mute tracking-wider mb-1.5">SUGGESTED REPLY</div>
            <div className="text-[12.5px] text-text-dark/80 leading-relaxed italic">
              "Hey, thanks for reaching out. Saw the South Tampa storm damage note. I can be out today between 2 and 4. Does that work?"
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-text-dark text-white text-[12px] font-semibold">
              Claim this lead
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[11px] text-text-mute">pauses auto-replier</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
