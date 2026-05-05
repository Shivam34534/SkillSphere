/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#050508',
          surface: '#110e17',
        },
        primary: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
        },
        secondary: {
          DEFAULT: '#d946ef',
        },
        accent: {
          DEFAULT: '#3b82f6',
        },
        success: {
          DEFAULT: '#10b981',
        },
        text: {
          main: '#f8f8fa',
          muted: '#94a3b8',
        },
        'glass-border': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(17, 14, 23, 0.7) 0%, rgba(17, 14, 23, 0.3) 100%)',
      },
      backdropBlur: {
        'glass': '20px',
      }
    },
  },
  plugins: [],
}
