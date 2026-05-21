import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { signInWithPassword, signUpWithPassword, signInWithMagicLink, getUser } from '../lib/auth';

export default function SignIn() {
  const nav = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup' | 'magic'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    getUser().then((u) => {
      if (u) nav('/app', { replace: true });
    });
  }, [nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await signInWithPassword(email, password);
        if (error) throw error;
        nav('/app', { replace: true });
      } else if (mode === 'signup') {
        const { data, error } = await signUpWithPassword(email, password);
        if (error) throw error;
        if (data.session) {
          nav('/app', { replace: true });
        } else {
          setInfo('Check your email to confirm your account, then sign in.');
        }
      } else {
        const { error } = await signInWithMagicLink(email);
        if (error) throw error;
        setInfo('Magic link sent. Check your email to finish signing in.');
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink-700 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-purple pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(6,212,250,0.12),transparent_55%)] pointer-events-none" />

      <header className="relative z-10 mx-auto max-w-7xl px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5 w-fit">
          <Logo size={32} withWordmark wordmarkColor="white" />
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-md px-6 pt-16 pb-24">
        <div className="rounded-2xl border-gradient bg-ink-800/80 backdrop-blur-xl p-1">
          <div className="rounded-[14px] bg-ink-800/95 p-8">
            <div className="text-[11px] font-mono text-neon-cyan tracking-wider mb-2">
              {mode === 'signin' ? 'SIGN IN' : mode === 'signup' ? 'CREATE ACCOUNT' : 'MAGIC LINK'}
            </div>
            <h1 className="font-display font-extrabold text-white text-3xl mb-7 tracking-tight">
              {mode === 'signin' ? 'Welcome back.' : mode === 'signup' ? 'Start triaging.' : 'Sign in via email.'}
            </h1>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-white/55 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-neon-cyan/50 focus:bg-white/[0.06] transition"
                  placeholder="you@yourbusiness.com"
                />
              </div>
              {mode !== 'magic' && (
                <div>
                  <label className="block text-xs font-mono text-white/55 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-neon-cyan/50 focus:bg-white/[0.06] transition"
                    placeholder="at least 6 characters"
                  />
                </div>
              )}

              {err && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 px-3.5 py-2.5 text-sm text-rose-200">
                  {err}
                </div>
              )}
              {info && (
                <div className="rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 px-3.5 py-2.5 text-sm text-neon-cyan">
                  {info}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-gradient-rainbow-animated py-2.5 text-sm font-semibold text-white shadow-glow-purple disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99] transition"
              >
                {busy
                  ? 'Working…'
                  : mode === 'signin'
                  ? 'Sign in'
                  : mode === 'signup'
                  ? 'Create account'
                  : 'Send magic link'}
              </button>
            </form>

            <div className="mt-7 space-y-2 text-center text-xs text-white/55">
              {mode === 'signin' && (
                <>
                  <div>
                    No account?{' '}
                    <button onClick={() => setMode('signup')} className="text-neon-cyan hover:underline">
                      Create one
                    </button>
                  </div>
                  <div>
                    Or{' '}
                    <button onClick={() => setMode('magic')} className="text-neon-cyan hover:underline">
                      use a magic link
                    </button>
                  </div>
                </>
              )}
              {mode === 'signup' && (
                <div>
                  Already signed up?{' '}
                  <button onClick={() => setMode('signin')} className="text-neon-cyan hover:underline">
                    Sign in
                  </button>
                </div>
              )}
              {mode === 'magic' && (
                <div>
                  Prefer a password?{' '}
                  <button onClick={() => setMode('signin')} className="text-neon-cyan hover:underline">
                    Sign in
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/[0.08] text-[11px] text-white/40 leading-relaxed">
              Your first sign-in seeds three example widgets (Tampa Roofing Co, Studio Bloom Photography, Westside Auto Repair) with twelve sample conversations so you can poke around right away.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
