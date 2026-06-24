/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ledger: {
          navy: '#0B1F3A',
          navyLight: '#16335C',
          cream: '#F7F4EC',
          paper: '#FBF9F3',
          dark: '#0E1B16',
          darkSurface: '#152821',
          green: '#2F9E6E',
          greenDark: '#1F7A53',
          amber: '#D9763B',
          amberDark: '#B85D29',
          slate: '#8B95A6',
          line: '#E3DFD2',
          lineDark: '#22352D',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(11, 31, 58, 0.04), 0 1px 1px 0 rgba(11, 31, 58, 0.03)',
        cardHover: '0 4px 12px -2px rgba(11, 31, 58, 0.08)',
      },
      borderRadius: {
        card: '14px',
      },
      backgroundImage: {
        'ledger-ticks':
          'repeating-linear-gradient(90deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
