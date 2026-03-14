module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      colors: {
        // Islamic Green primary palette
        brand: {
          50:  '#eefbf4',
          100: '#d6f5e3',
          200: '#b0eacb',
          300: '#7dd8ad',
          400: '#48bc89',
          500: '#27a06d',
          600: '#1a8f5c',   // Main Islamic green
          700: '#15724a',
          800: '#135b3c',
          900: '#114a32',
          950: '#08291d',
        },
        // Neutral greys
        slate: {
          950: '#020617',
        },
        // Warm accent for hover states
        forest: {
          600: '#166534',
          700: '#14532d',
        }
      },
      boxShadow: {
        'soft':     '0 2px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'elevated': '0 20px 25px -5px rgba(0,0,0,0.10), 0 10px 10px -5px rgba(0,0,0,0.04)',
        'card':     '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
        'green':    '0 4px 14px 0 rgba(26,143,92,0.35)',
      },
      letterSpacing: {
        wider: '0.05em',
        widest: '0.1em',
      },
      lineHeight: {
        relaxed: '1.6',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'mosque-hero': "url('/mosque-hero.png')",
        'green-gradient': 'linear-gradient(135deg, #1a8f5c 0%, #166534 100%)',
        'hero-overlay': 'linear-gradient(to bottom, rgba(8,41,29,0.55) 0%, rgba(8,41,29,0.30) 50%, rgba(0,0,0,0.70) 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
