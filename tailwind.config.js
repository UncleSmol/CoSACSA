/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color-green)',
        'primary-light': 'var(--color-light-green)',
        'gold': 'var(--color-gold)',
        'gold-dark': 'var(--color-dark-gold)',
        'accent': 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        'accent-dark': 'var(--color-accent-dark)'
      },
      fontFamily: {
        'primary': 'var(--font-family-primary)',
        'secondary': 'var(--font-family-secondary)'
      },
      boxShadow: {
        'custom': 'var(--shadow-md)',
        'custom-lg': 'var(--shadow-lg)'
      },
      borderRadius: {
        'custom': 'var(--border-radius-md)'
      }
    },
  },
  plugins: [],
}
