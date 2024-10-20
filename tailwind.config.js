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
        'primary': 'var(--color-primary)',
        'primary-text': 'var(--text-primary)',
        'secondary-text': 'var(--text-secondary)',
        'primary-bg': 'var(--bg-primary)',
        'primary-btn': 'var(--btn-primary)',
        'hover-btn': 'var(--btn-hover)',
      },
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        serif: ['Montserrat', 'sans-serif']
      },
    },
  },
  plugins: [],
}