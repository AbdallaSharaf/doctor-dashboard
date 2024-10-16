/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-text': 'var(--text-primary)',
        'primary-bg': 'var(--bg-primary)',
      },
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        serif: ['Montserrat', 'sans-serif']
      },
    },
  },
  plugins: [],
}