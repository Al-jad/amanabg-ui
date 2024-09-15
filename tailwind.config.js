/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        default: '2rem',
        sm: '0.5rem',
      }

    },
    extend: {
      screens: {
        'xs': '475px',
        'sm': { 'max': '639px' },
      },
      colors: {
        'DarkBlue': '#263649',
        'DarkNavy': '#1F2C3B',
        'LighBlue': '#3F5774',
        'Lime': '#C8E946',
        'Yellow': '#F29C1F',
        'LightGray': '#EBE1E1',
        'Gray': '#8AA4C2',
        'TableHeader': '#E2E8F0',
        'HoverDarkBlue': '#2d445f'
      },
    },
  },
  plugins: [],
}
