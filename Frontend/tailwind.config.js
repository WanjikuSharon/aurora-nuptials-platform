/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f7',
          100: '#feeaea',
          200: '#fdd8d8',
          300: '#fbb9b9',
          400: '#f68e8e',
          500: '#ec5757',
          600: '#d73f3f',
          700: '#b52f2f',
          800: '#9a2929',
          900: '#822626',
        },
        // Classic Romantic Blush & Gold Elegance Theme
        'blush-pink': '#FADADD',
        'rose-gold': '#B76E79',
        'champagne': '#F7E7CE',
        'gold-accent': '#D4AF37',
        'pure-white': '#FFFFFF',
        // Legacy color mappings for existing components
        'rose-dust': '#FADADD', // Now maps to blush pink
        'rose-blush': '#F7E7CE', // Now maps to champagne/beige
        'deep-rose': '#B76E79', // Now maps to rose gold
        'dusty-rose': '#FADADD', // Now maps to blush pink
        'soft-cream': '#F7E7CE', // Now maps to champagne/beige
        'warm-gray': '#B76E79', // Now maps to rose gold
        'champagne-gold': '#D4AF37', // Maps to gold accent
        'ivory': '#FFFFFF' // Maps to pure white
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}