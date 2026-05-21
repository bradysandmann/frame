import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ChatMockup from '../components/ChatMockup';

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
            <a href="#how" className="hover:text-white transition">How it works</a>
            <a href="#triage" className="hover:text-white transition">Triage</a>
            <a href="#install" className="hover:text-white transition">Install</a>
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-purple pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(157,92,227,0.18),transparent_60%)] pointer-events-none" />
        {/* faint grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-32 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-3 py-1.5 text-[11px] font-mono text-white/70 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse-soft" />
              CHAT TRIAGE / WEB WIDGET / NO VOICE
            </div>
            <h1
              className="font-display font-extrabold tracking-tight text-white leading-[0.95]"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              Inbound chat<br />
              triage that <br />
              <span className="text-gradient">doesn't miss the buyer.</span>
            </h1>
            <p className="mt-7 text-white/70 text-lg max-w-xl leading-relaxed">
              Frame drops a chat widget on your site, reads every incoming message in your brand voice, and routes the real buyers to you in seconds. Everything else gets handled.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-rainbow-animated px-6 py-3 text-sm font-semibold text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.99] transition"
              >
                Sign in to set up your widget
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="#triage"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/10 px-5 py-3 text-sm font-medium text-white/85 hover:bg-white/[0.08] transition"
              >
                See triage in action
              </a>
            </div>
            <div className="mt-10 flex items-center gap-7 text-[12px] text-white/45 font-mono">
              <span>~9s avg triage</span>
              <span className="w-px h-3 bg-white/15" />
              <span>~85% of noise auto-handled</span>
              <span className="w-px h-3 bg-white/15" />
              <span>JSON-strict intents</span>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end animate-float-slow">
            <ChatMockup />
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-[0.5fr_1fr] gap-12">
            <div>
              <div className="text-[11px] font-mono text-neon-cyan tracking-wider mb-3">HOW IT WORKS</div>
              <h2 className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
                Triage on the way in,<br />not after the buyer leaves.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
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
                <div key={c.step} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 hover:bg-white/[0.05] transition">
                  <div className="text-[11px] font-mono text-white/35 mb-3">{c.step}</div>
                  <div className="text-white font-semibold mb-2">{c.title}</div>
                  <div className="text-white/60 text-sm leading-relaxed">{c.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Triage detail */}
      <section id="triage" className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] font-mono text-neon-magenta tracking-wider mb-3">FIVE INTENTS</div>
            <h2 className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Every message gets <span className="text-gradient">classified.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'Lead', color: 'from-neon-cyan to-neon-magenta', desc: 'Buyer with details, timeline, or urgency. Routes to owner immediately.' },
              { name: 'Support', color: 'from-emerald-400 to-emerald-300', desc: 'General question. Frame answers directly in your brand voice.' },
              { name: 'Billing', color: 'from-amber-400 to-amber-200', desc: 'Account, invoice, or refund. Routes to owner with context attached.' },
              { name: 'Out of scope', color: 'from-white/40 to-white/20', desc: 'Service you do not offer. Redirected politely, archived.' },
              { name: 'Spam', color: 'from-rose-400 to-rose-300', desc: 'Promotional, off-topic, or bot. Archived without your inbox seeing it.' },
            ].map((i) => (
              <div key={i.name} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 hover:bg-white/[0.05] transition">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${i.color} mb-4`} />
                <div className="text-white font-semibold mb-1.5">{i.name}</div>
                <div className="text-white/55 text-[13px] leading-relaxed">{i.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Install snippet */}
      <section id="install" className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid lg:grid-cols-[0.6fr_1fr] gap-12 items-center">
            <div>
              <div className="text-[11px] font-mono text-neon-cyan tracking-wider mb-3">INSTALL</div>
              <h2 className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
                One script tag.<br />Two minutes.
              </h2>
              <p className="mt-5 text-white/65 leading-relaxed">
                Paste once before <span className="font-mono text-neon-cyan">&lt;/body&gt;</span>. The widget loads on visitor intent, not page-load, so your Lighthouse score stays green.
              </p>
            </div>
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
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[11px] font-mono text-white/45 tracking-wider mb-3">PRICING</div>
            <h2 className="font-display font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Pay per <span className="text-gradient">routed lead.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { name: 'Solo', price: '$49', sub: '/mo', items: ['1 widget', '50 routed leads/mo', 'Auto-reply unlimited', 'Email-to-owner alerts'] },
              { name: 'Shop', price: '$149', sub: '/mo', featured: true, items: ['5 widgets', '300 routed leads/mo', 'Custom escalation logic', 'Resend + Slack alerts'] },
              { name: 'Agency', price: 'Custom', sub: '', items: ['Unlimited widgets', 'White-label dashboard', 'Multi-owner routing', 'Priority Claude tier'] },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-7 border ${
                  p.featured
                    ? 'border-gradient bg-white/[0.04]'
                    : 'border-white/[0.08] bg-white/[0.02]'
                } relative`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-7 px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-gradient-rainbow text-white tracking-wider">
                    POPULAR
                  </div>
                )}
                <div className="text-white font-semibold mb-2">{p.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-white text-4xl font-display font-extrabold">{p.price}</span>
                  <span className="text-white/45 text-sm">{p.sub}</span>
                </div>
                <ul className="space-y-2.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-white/70 text-sm">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="#9D5CE3" strokeWidth="1.3" />
                        <path d="M5 8.5L7 10.5L11 6.5" stroke="#06D4FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display font-extrabold text-white tracking-tight mb-6" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            Stop missing buyers <span className="text-gradient">in chat.</span>
          </h2>
          <p className="text-white/65 text-lg mb-9">
            Set up your widget in two minutes. Triage starts the first time someone messages.
          </p>
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
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/45">
          <div className="flex items-center gap-2.5">
            <Logo size={22} withWordmark wordmarkColor="rgba(255,255,255,0.8)" />
          </div>
          <div className="font-mono text-[12px]">© 2026 Frame. Triage built for small shops.</div>
        </div>
      </footer>
    </div>
  );
}
