/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        futura: {
          bg: "#08090B",
          surface: "#15171C",
          card: "#191C22",
          elevated: "#20232A",
          text: "#F5F3EF",
          muted: "#A6AFBD",
          border: "#30343C",
          gold: "#E6C17D",
          'gold-hover': "#F0D399",
          green: "#80C9A0",
          coral: "#E27D78",
          silver: "#A9B8C8",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle-glow': '0 0 35px -5px rgba(213, 180, 119, 0.12)',
        'phone-glow': '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(169, 184, 200, 0.08)',
        'silver-rim': 'inset 0 0 0 1px rgba(169, 184, 200, 0.25)',
        'card-depth': '0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'coral-glow': '0 0 30px -5px rgba(226, 125, 120, 0.2)',
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-reverse': 'floatReverse 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0.5deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(8px) rotate(-0.5deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
