/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: '#1D9E75', light: '#E1F5EE', dark: '#085041' },
        coral: { DEFAULT: '#D85A30', light: '#FAECE7' },
        amber: { DEFAULT: '#BA7517', light: '#FAEEDA' },
        purple: { DEFAULT: '#7F77DD', light: '#EEEDFE' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
