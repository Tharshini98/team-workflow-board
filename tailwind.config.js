/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#14171c',
          700: '#2b3038',
          500: '#5b6270',
          300: '#a8afba',
          100: '#eef0f3',
        },
        brand: {
          600: '#3457d5',
          500: '#4b6bef',
          100: '#e7ecff',
        },
        good: { 600: '#1a7f4e', 100: '#e3f6ec' },
        warn: { 600: '#a3660a', 100: '#fdf1dc' },
        bad: { 600: '#b3261e', 100: '#fbe6e4' },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,23,28,0.06), 0 1px 1px rgba(20,23,28,0.04)',
        pop: '0 12px 32px rgba(20,23,28,0.18)',
      },
      borderRadius: {
        md2: '10px',
      },
    },
  },
  plugins: [],
}
