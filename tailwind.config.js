/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1D6FE8',
          50:  '#EBF2FD',
          100: '#C2D9FA',
          200: '#99C0F7',
          300: '#70A7F4',
          400: '#478EF1',
          500: '#1D6FE8',
          600: '#175CC0',
          700: '#124898',
          800: '#0C3570',
          900: '#072248',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      minHeight: { tap: '44px' },
      minWidth: { tap: '44px' },
    },
  },
  plugins: [],
}
