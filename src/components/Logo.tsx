interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  wordmarkColor?: string;
}

export default function Logo({ size = 36, withWordmark = false, wordmarkColor = 'white' }: LogoProps) {
  const id = `frameGrad-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Frame">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06D4FA" />
            <stop offset="50%" stopColor="#9D5CE3" />
            <stop offset="100%" stopColor="#E83E8C" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="40" height="40" rx="10" fill={`url(#${id})`} />
        <path
          d="M13 12.5h14a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5h-7.6L14.5 30v-4.5H13a1.5 1.5 0 0 1-1.5-1.5V14a1.5 1.5 0 0 1 1.5-1.5Z"
          fill="white"
        />
        <circle cx="17" cy="19" r="1.3" fill="#1a0d2e" />
        <circle cx="20.5" cy="19" r="1.3" fill="#1a0d2e" />
        <circle cx="24" cy="19" r="1.3" fill="#1a0d2e" />
      </svg>
      {withWordmark && (
        <span
          className="font-display font-extrabold tracking-tight"
          style={{ fontSize: size * 0.66, color: wordmarkColor, letterSpacing: '-0.03em' }}
        >
          Frame
        </span>
      )}
    </span>
  );
}
