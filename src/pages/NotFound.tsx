import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-700 text-white flex flex-col items-center justify-center px-6">
      <Logo size={56} />
      <h1 className="font-display font-extrabold text-white text-5xl tracking-tight mt-7 mb-3">
        404
      </h1>
      <p className="text-white/65 mb-8">That page never made it past triage.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-rainbow-animated px-6 py-3 text-sm font-semibold text-white shadow-glow-purple hover:scale-[1.02] active:scale-[0.99] transition"
      >
        Back to home
      </Link>
    </div>
  );
}
