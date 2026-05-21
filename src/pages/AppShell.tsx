import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Logo from '../components/Logo';
import { getUser, signOut, seedIfEmpty } from '../lib/auth';

export default function AppShell() {
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (!u) {
        nav('/signin', { replace: true });
        return;
      }
      setEmail(u.email ?? null);
      await seedIfEmpty(u.id);
      setLoading(false);
    })();
  }, [nav]);

  async function handleSignOut() {
    await signOut();
    nav('/signin', { replace: true });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-light-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-mute text-sm">
          <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
          Preparing your widgets…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-50 text-text-dark">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-light-50/85 border-b border-light-200">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2.5">
            <Logo size={28} withWordmark wordmarkColor="#1B1530" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className={`text-sm px-3 py-1.5 rounded-full transition ${
                loc.pathname === '/app'
                  ? 'bg-text-dark text-white'
                  : 'text-text-mute hover:text-text-dark'
              }`}
            >
              Dashboard
            </Link>
            <div className="text-xs text-text-mute font-mono hidden sm:block">{email}</div>
            <button
              onClick={handleSignOut}
              className="text-sm text-text-mute hover:text-text-dark transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
