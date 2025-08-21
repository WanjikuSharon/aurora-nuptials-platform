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
          500: '#0A192F', // Navy primary
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Navy + Gold + Champagne (Luxury Classic)
        'navy': '#0A192F',            // Primary brand color
        'champagne': '#F7E7CE',       // Soft base
        'gold': '#D4AF37',            // Luxury accent
        'ivory': '#FAF9F6',           // Clean backgrounds
        'rose-gold-accent': '#B76E79', // Optional accent
        
        // Typography colors
        'charcoal': '#2E2E2E',        // Headings for readability
        'medium-gray': '#555555',     // Subtext for readability
        'pure-white': '#FFFFFF',      // Pure white for contrast
        
        // Legacy mappings (updated to luxury palette)
        'deep-blush': '#0A192F',      // Maps to navy
        'rose-gold': '#D4AF37',       // Maps to gold
        'rose-dust': '#F7E7CE',       // Maps to champagne
        'rose-blush': '#FAF9F6',      // Maps to ivory
        'deep-rose': '#0A192F',       // Maps to navy
        'dusty-rose': '#F7E7CE',      // Maps to champagne
        'soft-cream': '#FAF9F6',      // Maps to ivory
        'warm-gray': '#2E2E2E',       // Maps to charcoal
        'champagne-gold': '#D4AF37',  // Maps to gold
        'ivory': '#FAF9F6',           // Maps to ivory
        'blush-pink': '#F7E7CE',      // Maps to champagne
        'gold-accent': '#D4AF37',     // Maps to gold
        
        // Gradient helper colors
        'champagne-overlay': 'rgba(247, 231, 206, 0.6)',
        'navy-overlay': 'rgba(10, 25, 47, 0.8)'
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
        'premium': '0 4px 20px rgba(10, 25, 47, 0.15)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.15)',
        'navy': '0 4px 20px rgba(10, 25, 47, 0.25)',
        'soft': '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0A192F 0%, #F7E7CE 100%)',
        'navy-gradient': 'linear-gradient(135deg, #0A192F 0%, #2A3E5F 100%)',
        'champagne-gradient': 'linear-gradient(135deg, #F7E7CE 0%, #FAF9F6 100%)',
        'hero-overlay': 'linear-gradient(rgba(10, 25, 47, 0.6), rgba(10, 25, 47, 0.6))',
        'gold-divider': 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}