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
        'sidebar-secondary-text': 'var(--sidebar-text-secondary)',
        'sidebar-primary-text': 'var(--sidebar-text-primary)',
        'secondary-text': 'var(--text-secondary)',
        'primary-bg': 'var(--bg-primary)',
        'primary-btn': 'var(--btn-primary)',
        'sidebar-toggler': 'var(--sidebar-toggler)',
        'hover-btn': 'var(--btn-hover)',
        'border-color':  'var(--border-color)',
      },
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
        serif: ['Montserrat', 'sans-serif']
      },
    },
  },
  plugins: [],
}