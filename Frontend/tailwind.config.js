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
          50: '#f0f4ff',
          100: '#dfe7ff',
          200: '#c5d4ff',
          300: '#a3b9fc',
          400: '#8194f6',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Modern Luxury Navy & Gold Theme
        'navy-blue': '#0A192F',
        'champagne-gold': '#D4AF37',
        'ivory': '#F8F5F2',
        'blush-accent': '#F4C2C2',
        'charcoal': '#333333',
        // Legacy color mappings for existing components
        'rose-gold': '#D4AF37', // Now maps to champagne gold
        'rose-dust': '#F4C2C2', // Now maps to blush accent
        'rose-blush': '#F8F5F2', // Now maps to ivory
        'deep-rose': '#0A192F', // Now maps to navy blue
        'dusty-rose': '#F4C2C2', // Now maps to blush accent
        'soft-cream': '#F8F5F2', // Now maps to ivory
        'warm-gray': '#333333' // Now maps to charcoal
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