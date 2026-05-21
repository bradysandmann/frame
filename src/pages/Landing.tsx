import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';
import LiveDemo from '../components/LiveDemo';
import RouteEmailScreenshot from '../components/RouteEmailScreenshot';
import Reveal, { StaggerReveal, StaggerItem } from '../components/Reveal';

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-700 text-white">
      {/* Nav */}
      <header className="relative z-20">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={32} withWordmark wordmarkColor="white" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#demo" className="hover:text-white transition">Demo</a>
            <a href="#how" className="hover:text-white transition">How it works</a>
            <a href="#email" className="hover:text-white transition">Routing email</a>
            <a href="#triage" className="hover:text-white transition">Triage</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </nav>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 rounded-full bg-white text-ink-700 px-4 py-2 text-sm font-semibold hover:bg-white/90 transition"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero with live demo on the right */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-purple pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(157,92,227,0.18),transparent_60%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-3 py-1.5 text-[11px] font-mono text-white/70 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse-soft" />
              CHAT TRIAGE / WEB WIDGET / NO VOICE
            </div>
            <h1
              className="font-display font-extrabold tracking-tight text-white leading-[0.95]"
              style={{ fontSize: 'clamp(44px, 6.4vw, 88px)' }}
            >
              Inbound chat<br />
              triage that <br />
              <span className="text-gradient">doesn't miss the buyer.</span>
            </h1>
            <p className="mt-7 text-white/75 text-lg max-w-xl leading-relaxed">
              <span className="text-white font-semibold">Five categories, one email, zero missed leads.</span> Frame drops a chat widget on your site, classifies every message into lead, support, billing, out-of-scope, or spam, and routes the real buyers to your inbox in seconds.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-rainbow-animated px-6 py-3 text-sm font-semibold text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.99] transition"
              >
                Try the demo
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/10 px-5 py-3 text-sm font-medium text-white/85 hover:bg-white/[0.08] transition"
              >
                Sign in to set up your widget
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-7 text-[12px] text-white/45 font-mono">
              <span>~9s avg triage</span>
              <span className="w-px h-3 bg-white/15" />
              <span>~85% of noise auto-handled</span>
              <span className="w-px h-3 bg-white/15" />
              <span>JSON-strict intents</span>
            </div>
          </motion.div>

          {/* Live demo widget */}
          <motion.div
            id="demo"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="absolute -inset-8 bg-gradient-to-br from-neon-cyan/20 via-neon-purple/25 to-neon-magenta/20 blur-3xl pointer-events-none" />
            <div className="relative animate-float-slow">
              <LiveDemo />
            </div>
          </motion.div>
        </div>
      </section>

      {/* The routing email screenshot section */}
      <section id="email" className="relative py-24 border-t border-white/[0.06]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-center">
          <Reveal>
            <div className="text-[11px] font-mono text-neon-magenta tracking-wider mb-3">
              THE ROUTING EMAIL
            </div>
            <h2 className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
              What you actually <span className="text-gradient">get in your inbox.</span>
            </h2>
            <p className="mt-6 text-white/70 text-lg leading-relaxed max-w-xl">
              Every routed lead lands as a single email with the transcript, Frame's reasoning, a suggested reply, and a one-click "claim this lead" link that pauses the auto-replier so you do not double-respond.
            </p>
            <ul className="mt-7 space-y-3 max-w-md">
              {[
                'Full transcript so you can match tone',
                'Confidence score and the why behind the call',
                'Suggested reply you can ship or rewrite',
                'Claim link pauses Frame so you do not collide',
              ].map((it) => (
                <li key={it} className="flex items-start gap-3 text-white/80 text-[14.5px]">
                  <svg className="w-4 h-4 mt-1 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#9D5CE3" strokeWidth="1.3" />
                    <path d="M5 8.5L7 10.5L11 6.5" stroke="#06D4FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="flex justify-center lg:justify-end">
            <RouteEmailScreenshot />
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-[0.5fr_1fr] gap-12">
            <Reveal>
              <div className="text-[11px] font-mono text-neon-cyan tracking-wider mb-3">HOW IT WORKS</div>
              <h2 className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
                Triage on the way in,<br />not after the buyer leaves.
              </h2>
            </Reveal>
            <StaggerReveal className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  step: '01',
                  title: 'Configure your brand',
                  body: 'Plain-English brand voice, escalation rules, owner email. Two text fields, done.',
                },
                {
                  step: '02',
                  title: 'Drop the snippet',
                  body: 'One inline script tag. Loads under 14kb, no SDK, no build step on your site.',
                },
                {
                  step: '03',
                  title: 'Frame reads everything',
                  body: 'Every message classified as lead, support, billing, out-of-scope, or spam.',
                },
                {
                  step: '04',
                  title: 'Routes buyers, replies to the rest',
                  body: 'Leads land in your inbox in seconds with a transcript and intent reasoning.',
                },
              ].map((c) => (
                <StaggerItem key={c.step}>
                  <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5 h-full">
                    <div className="text-[11px] font-mono text-white/35 mb-3">{c.step}</div>
                    <div className="text-white font-semibold mb-2">{c.title}</div>
                    <div className="text-white/60 text-sm leading-relaxed">{c.body}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* Triage detail */}
      <section id="triage" className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-mono text-neon-magenta tracking-wider mb-3">FIVE INTENTS</div>
            <h2 className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Every message gets <span className="text-gradient">classified.</span>
            </h2>
            <p className="mt-5 text-white/65 text-base">
              Each category routes differently. You set the rules; Frame applies them every time.
            </p>
          </Reveal>
          <StaggerReveal className="grid md:grid-cols-2 lg:grid-cols-5 gap-4" stagger={0.06}>
            {[
              { name: 'Lead', color: 'from-neon-cyan to-neon-magenta', glow: 'group-hover:shadow-glow-purple', desc: 'Buyer with details, timeline, or urgency. Routes to owner immediately.' },
              { name: 'Support', color: 'from-emerald-400 to-emerald-300', glow: 'group-hover:shadow-[0_0_40px_rgba(52,211,153,0.35)]', desc: 'General question. Frame answers directly in your brand voice.' },
              { name: 'Billing', color: 'from-amber-400 to-amber-200', glow: 'group-hover:shadow-[0_0_40px_rgba(251,191,36,0.35)]', desc: 'Account, invoice, or refund. Routes to owner with context attached.' },
              { name: 'Out of scope', color: 'from-white/40 to-white/20', glow: 'group-hover:shadow-[0_0_40px_rgba(255,255,255,0.18)]', desc: 'Service you do not offer. Redirected politely, archived.' },
              { name: 'Spam', color: 'from-rose-400 to-rose-300', glow: 'group-hover:shadow-[0_0_40px_rgba(244,114,182,0.35)]', desc: 'Promotional, off-topic, or bot. Archived without your inbox seeing it.' },
            ].map((i) => (
              <StaggerItem key={i.name}>
                <div className={`group rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 hover:bg-white/[0.06] hover:border-white/[0.14] hover:-translate-y-1 transition-all duration-300 h-full ${i.glow}`}>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${i.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
                  <div className="text-white font-semibold mb-1.5">{i.name}</div>
                  <div className="text-white/55 text-[13px] leading-relaxed">{i.desc}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Install snippet */}
      <section id="install" className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid lg:grid-cols-[0.6fr_1fr] gap-12 items-center">
            <Reveal>
              <div className="text-[11px] font-mono text-neon-cyan tracking-wider mb-3">INSTALL</div>
              <h2 className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                One script tag.<br />Two minutes.
              </h2>
              <p className="mt-5 text-white/65 leading-relaxed">
                Paste once before <span className="font-mono text-neon-cyan">&lt;/body&gt;</span>. The widget loads on visitor intent, not page-load, so your Lighthouse score stays green.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative rounded-2xl bg-ink-800/90 border border-white/10 p-1 border-gradient">
                <div className="rounded-[14px] bg-ink-900 px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                    </div>
                    <div className="text-[10px] font-mono text-white/40">frame.js</div>
                  </div>
                  <pre className="text-[13px] font-mono text-white/90 leading-relaxed overflow-x-auto">
{`<script
  src="https://frame.app/widget.js"
  data-frame-id="tpa-roof-001"
  defer
></script>`}
                  </pre>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing - flat-rate, transparent */}
      <section id="pricing" className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center max-w-3xl mx-auto mb-14">
            <div className="text-[11px] font-mono text-white/45 tracking-wider mb-3">PRICING</div>
            <h2 className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
              One flat fee per workspace. <span className="text-gradient">No surprise bills.</span>
            </h2>
            <p className="mt-5 text-white/70 text-base leading-relaxed">
              The biggest complaint about Intercom and Tidio is that AI usage stacks until the monthly bill is 2-3x what was quoted. Frame prices one number per workspace with the overage threshold visible upfront.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
            {/* Main flat-rate card */}
            <Reveal>
              <div className="relative rounded-2xl border-gradient bg-gradient-to-br from-white/[0.05] via-white/[0.03] to-white/[0.04] p-1 h-full">
                <div className="rounded-[15px] bg-ink-700/85 backdrop-blur p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-semibold text-lg">Workspace</div>
                    <div className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-gradient-rainbow text-white tracking-wider">
                      FLAT-RATE
                    </div>
                  </div>
                  <div className="text-white/60 text-sm mb-6">Everything one shop, agency client, or SaaS team needs.</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-white text-6xl font-display font-extrabold tracking-tight">$99</span>
                    <span className="text-white/50 text-base">/workspace/month</span>
                  </div>
                  <div className="text-white/55 text-[13px] font-mono mb-6">
                    Includes 5,000 messages. Then <span className="text-neon-cyan">$0.02</span> per additional message. Threshold visible in the dashboard.
                  </div>
                  <ul className="space-y-3 mb-7 flex-1">
                    {[
                      'Unlimited widgets, unlimited domains',
                      'Lead, support, billing, out-of-scope, spam classifier',
                      'Email-to-owner routing on every high-value lead',
                      'Brand-voice auto-reply on the rest',
                      'Knowledge base ingestion (URL, PDF, markdown)',
                      'Live dashboard with conversation history',
                      'One-click human handoff',
                      'Cancel any time, billed monthly',
                    ].map((it) => (
                      <li key={it} className="flex items-start gap-2.5 text-white/80 text-[14px]">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="#9D5CE3" strokeWidth="1.3" />
                          <path d="M5 8.5L7 10.5L11 6.5" stroke="#06D4FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {it}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signin"
                    className="block w-full text-center rounded-full bg-gradient-rainbow-animated px-6 py-3 text-sm font-semibold text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.99] transition"
                  >
                    Start your workspace
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Right-side cards */}
            <div className="flex flex-col gap-6">
              <Reveal delay={0.08}>
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-semibold">Agency</div>
                    <div className="text-[10px] font-mono text-white/40">PER-CLIENT</div>
                  </div>
                  <div className="text-white/55 text-sm mb-4">Resell Frame under your own brand. White-label dashboard, unified billing.</div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-white text-3xl font-display font-extrabold">$79</span>
                    <span className="text-white/45 text-sm">/client/month, 5+ clients</span>
                  </div>
                  <div className="text-white/45 text-[12px] font-mono">Same 5,000-message threshold per client. Includes white-label.</div>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 hover:bg-white/[0.05] hover:border-white/[0.14] transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-semibold">Volume</div>
                    <div className="text-[10px] font-mono text-white/40">CUSTOM</div>
                  </div>
                  <div className="text-white/55 text-sm mb-4">Over 50,000 messages per month, dedicated routing, priority Claude tier.</div>
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-white text-3xl font-display font-extrabold">Custom</span>
                  </div>
                  <div className="text-white/45 text-[12px] font-mono">Email hello@frame.app for a quote.</div>
                </div>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="rounded-2xl bg-gradient-to-br from-neon-cyan/[0.05] via-neon-purple/[0.06] to-neon-magenta/[0.05] border border-neon-purple/15 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-gradient-rainbow flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1L10 6L15 6L11 9L13 14L8 11L3 14L5 9L1 6L6 6L8 1Z" fill="white" />
                      </svg>
                    </div>
                    <div className="text-white/85 text-[13px] leading-snug">
                      <span className="font-semibold text-white">No auto-renewal traps.</span> We email a renewal reminder seven days ahead. Cancel from the dashboard in one click.
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[11px] font-mono text-neon-cyan tracking-wider mb-3">VS THE FIELD</div>
            <h2 className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              Built for the shop, not the call center.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
              <div className="grid grid-cols-4 text-[12px] font-mono text-white/45 tracking-wider bg-white/[0.03] border-b border-white/10">
                <div className="px-5 py-3">FEATURE</div>
                <div className="px-5 py-3 text-center bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-neon-magenta/10 border-x border-white/10">
                  <span className="text-white font-semibold">FRAME</span>
                </div>
                <div className="px-5 py-3 text-center">INTERCOM FIN</div>
                <div className="px-5 py-3 text-center">TIDIO</div>
              </div>
              {[
                {
                  label: 'Predictable monthly cost',
                  frame: '$99 flat',
                  fin: '$29-$139 + $0.99/resolution',
                  tidio: '$29 + $39 per 50 AI chats',
                  frameWin: true,
                },
                {
                  label: 'Install time',
                  frame: '2 min, paste-snippet',
                  fin: '15-30 min, multi-step',
                  tidio: '90 sec, paste-snippet',
                  frameWin: false,
                },
                {
                  label: 'Hallucination guardrail',
                  frame: 'Strict KB grounding, refusal default',
                  fin: 'KB grounding, fallback to LLM',
                  tidio: 'KB grounding, fallback to LLM',
                  frameWin: true,
                },
                {
                  label: 'Built-in 5-category triage',
                  frame: 'Native',
                  fin: 'Configure manually',
                  tidio: 'Configure manually',
                  frameWin: true,
                },
                {
                  label: 'Right tier for sub-50-seat shops',
                  frame: 'Yes',
                  fin: 'Pricing leaves the room',
                  tidio: 'Yes until AI ramps',
                  frameWin: true,
                },
              ].map((row, idx) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-4 text-[13.5px] ${
                    idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'
                  } border-t border-white/[0.06]`}
                >
                  <div className="px-5 py-4 text-white/80 font-medium">{row.label}</div>
                  <div className={`px-5 py-4 text-center bg-gradient-to-br from-neon-cyan/[0.04] via-neon-purple/[0.04] to-neon-magenta/[0.04] border-x border-white/10 ${row.frameWin ? 'text-white font-semibold' : 'text-white/80'}`}>
                    {row.frame}
                  </div>
                  <div className="px-5 py-4 text-center text-white/55">{row.fin}</div>
                  <div className="px-5 py-4 text-center text-white/55">{row.tidio}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 border-t border-white/[0.06]">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display font-extrabold text-white tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            Stop missing buyers <span className="text-gradient">in chat.</span>
          </h2>
          <p className="text-white/65 text-lg mb-9">
            Set up your widget in two minutes. Triage starts the first time someone messages.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/15 px-6 py-3 text-sm font-medium text-white/85 hover:bg-white/[0.08] transition"
            >
              Replay the demo
            </a>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-rainbow-animated px-7 py-3.5 text-sm font-semibold text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.99] transition"
            >
              Sign in to set up your widget
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/45">
          <div className="flex items-center gap-2.5">
            <Logo size={22} withWordmark wordmarkColor="rgba(255,255,255,0.8)" />
          </div>
          <div className="font-mono text-[12px]">(c) 2026 Frame. Triage built for small shops.</div>
        </div>
      </footer>
    </div>
  );
}
