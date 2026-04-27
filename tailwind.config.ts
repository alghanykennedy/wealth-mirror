import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        obsidian: {
          950: '#060608',
          900: '#0d0d12',
          800: '#13131a',
          700: '#1a1a24',
          600: '#22222f',
          500: '#2e2e3f',
          400: '#3f3f55',
        },
        gold: {
          50:  '#fdf9ed',
          100: '#f9eed0',
          200: '#f3d898',
          300: '#ecbe5c',
          400: '#e5a82e',
          500: '#d48f14',
          600: '#b0700f',
          700: '#8a520d',
          800: '#6f4010',
          900: '#5e3612',
        },
        mirror: {
          50:  '#eef3fe',
          100: '#d6e3fc',
          200: '#b0c9f9',
          300: '#7ea5f4',
          400: '#4c7aed',
          500: '#2a55e0',
          600: '#1e3fc5',
          700: '#1a31a0',
          800: '#1a2c82',
          900: '#1b2a6a',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
