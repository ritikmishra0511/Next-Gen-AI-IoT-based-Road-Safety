/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#06090F',
        bg2: '#0B1018',
        bg3: '#101620',
        bg4: '#151D2A',
        teal: { DEFAULT: '#00E5C0', dim: 'rgba(0,229,192,0.12)' },
        danger: { DEFAULT: '#FF4757', dim: 'rgba(255,71,87,0.12)' },
        amber: { DEFAULT: '#FFB800', dim: 'rgba(255,184,0,0.12)' },
        violet: { DEFAULT: '#8B5CF6', dim: 'rgba(139,92,246,0.12)' },
        azure: { DEFAULT: '#3B82F6', dim: 'rgba(59,130,246,0.12)' },
        muted: '#8895A7',
        faint: '#4A5568',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      borderRadius: { xl2: '18px' },
      animation: {
        'fade-up': 'fadeUp 0.4s ease',
        'pulse-slow': 'pulse 1.4s infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 6px rgba(0,229,192,0.3)' },
          '50%': { boxShadow: '0 0 18px rgba(0,229,192,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
