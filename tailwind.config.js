/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#071D49',
          'navy-dark': '#04112B',
          'navy-light': '#0D2D6C',
          royal: '#075EE8',
          'royal-hover': '#0650C7',
          'royal-light': '#EBF2FE',
          bg: '#F3F7FF',
          card: '#FFFFFF',
          border: '#E2E8F0',
          'text-dark': '#0A1E42',
          'text-muted': '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px 0 rgba(7, 29, 73, 0.05)',
        'card-hover': '0 12px 28px -4px rgba(7, 94, 232, 0.14), 0 4px 12px -2px rgba(7, 29, 73, 0.06)',
        'dropdown': '0 12px 36px -4px rgba(7, 29, 73, 0.18)',
        'glow-blue': '0 0 20px -3px rgba(7, 94, 232, 0.4)',
        'glow-emerald': '0 0 16px -3px rgba(16, 185, 129, 0.35)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        badgePing: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' }
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-up': 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'floatSubtle 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
