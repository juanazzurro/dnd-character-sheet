/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#0f0f1a',
          100: '#1a1a2e',
          200: '#16213e',
          300: '#2a2a4a',
          400: '#3a3a5a',
          500: '#4a4a6a',
          600: '#5a5a7a',
          700: '#6a6a8a',
          800: '#7a7a9a',
          900: '#8a8aaa',
        },
        dnd: {
          red: '#8b0000',
          darkred: '#6b0000',
          'red-hover': '#a01010',
          gold: '#d4af37',
          darkgold: '#b8960c',
          amber: '#e8a020',
        },
        ink: {
          DEFAULT: '#f0e6d0',
          light: '#c8b8a0',
          muted: '#8a7a6a',
        },
      },
      fontFamily: {
        serif: ['JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        parchment: '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(212, 175, 55, 0.05)',
        'parchment-lg': '0 4px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(212, 175, 55, 0.08)',
        'gold-glow': '0 0 8px rgba(212, 175, 55, 0.3)',
        'gold-glow-lg': '0 0 16px rgba(212, 175, 55, 0.4)',
      },
    },
  },
  plugins: [],
}
