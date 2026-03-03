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
          50: '#fdf8f0',
          100: '#f9efdc',
          200: '#f2ddb8',
          300: '#e8c78a',
          400: '#dcac5a',
          500: '#cc9230',
          600: '#b07820',
          700: '#8a5c18',
          800: '#6b4412',
          900: '#4d2f0d',
        },
        dnd: {
          red: '#8b0000',
          darkred: '#6b0000',
          gold: '#d4af37',
          darkgold: '#b8960c',
        },
        ink: {
          DEFAULT: '#2c1810',
          light: '#4a2e20',
          muted: '#6b4c3b',
        },
      },
      fontFamily: {
        serif: ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'Georgia', 'serif'],
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        parchment: '0 2px 8px rgba(44, 24, 16, 0.15), 0 1px 3px rgba(44, 24, 16, 0.1)',
        'parchment-lg': '0 4px 16px rgba(44, 24, 16, 0.2), 0 2px 6px rgba(44, 24, 16, 0.15)',
      },
    },
  },
  plugins: [],
}
