/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0d0518',
          800: '#15082a',
          700: '#1a0d2e',
          600: '#241338',
          500: '#2d1947',
        },
        light: {
          50: '#FAFAFA',
          100: '#F4F2F7',
          200: '#E8E4EE',
        },
        text: {
          dark: '#1B1530',
          mute: '#6B6480',
        },
        neon: {
          cyan: '#06D4FA',
          purple: '#9D5CE3',
          magenta: '#E83E8C',
          mint: '#7CF0BD',
          amber: '#FFB547',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Inter Display"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'gradient-rainbow':
          'linear-gradient(120deg, #06D4FA 0%, #9D5CE3 50%, #E83E8C 100%)',
        'gradient-rainbow-soft':
          'linear-gradient(120deg, rgba(6,212,250,0.18) 0%, rgba(157,92,227,0.18) 50%, rgba(232,62,140,0.18) 100%)',
        'mesh-purple':
          'radial-gradient(at 20% 10%, rgba(6,212,250,0.25) 0px, transparent 50%), radial-gradient(at 80% 30%, rgba(232,62,140,0.22) 0px, transparent 50%), radial-gradient(at 50% 80%, rgba(157,92,227,0.28) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 40px rgba(6,212,250,0.35)',
        'glow-magenta': '0 0 40px rgba(232,62,140,0.35)',
        'glow-purple': '0 0 60px rgba(157,92,227,0.4)',
        'card-light': '0 1px 2px rgba(27,21,48,0.04), 0 8px 24px rgba(27,21,48,0.06)',
        'card-dark': '0 4px 18px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.06) inset',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '0.6' },
        },
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
