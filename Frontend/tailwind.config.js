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
          500: '#E6A6A1', // Deep blush primary
          600: '#d73f3f',
          700: '#b52f2f',
          800: '#9a2929',
          900: '#822626',
        },
        // Improved Classic Romantic Palette (Richer)
        'deep-blush': '#E6A6A1',      // Primary romantic color
        'rose-gold': '#c90aa9a6',       // Luxurious accent
        'champagne': '#F7E7CE',       // Soft base
        'gold-accent': '#D4AF37',     // Sparingly for icons/highlights
        'pure-white': '#FFFFFF',      // Text backgrounds, cards
        'charcoal': '#2E2E2E',        // Headings for readability
        'medium-gray': '#555555',     // Subtext for readability
        
        // Legacy mappings (updated to new palette)
        'blush-pink': '#E6A6A1',      // Maps to deep blush
        'rose-dust': '#E6A6A1',       // Maps to deep blush
        'rose-blush': '#F7E7CE',      // Maps to champagne
        'deep-rose': '#B76E79',       // Maps to rose gold
        'dusty-rose': '#E6A6A1',      // Maps to deep blush
        'soft-cream': '#F7E7CE',      // Maps to champagne
        'warm-gray': '#2E2E2E',       // Maps to charcoal
        'champagne-gold': '#D4AF37',  // Maps to gold accent
        'ivory': '#FFFFFF',           // Maps to pure white
        
        // Gradient helper colors
        'champagne-overlay': 'rgba(247, 231, 206, 0.6)'
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'premium': '12px',
        'soft': '8px',
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(230, 166, 161, 0.15)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.15)',
        'soft': '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'romantic-gradient': 'linear-gradient(135deg, #E6A6A1 0%, #F7E7CE 100%)',
        'hero-overlay': 'linear-gradient(rgba(247, 231, 206, 0.6), rgba(247, 231, 206, 0.6))',
        'gold-divider': 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}