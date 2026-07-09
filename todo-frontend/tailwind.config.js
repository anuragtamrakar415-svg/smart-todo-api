/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F5F0E6',
          card: '#FFFEFA',
          line: '#DCD2BA',
        },
        ink: {
          DEFAULT: '#211D18',
          soft: '#6B6459',
          faint: '#A69C8B',
        },
        brand: {
          DEFAULT: '#2B6E68',
          dark: '#1F504C',
          light: '#DCEAE7',
        },
        rust: {
          DEFAULT: '#8C2F39',
          light: '#F3DEE0',
        },
        ochre: {
          DEFAULT: '#A9781F',
          light: '#F3E7CB',
        },
        moss: {
          DEFAULT: '#3F7452',
          light: '#DDEBE0',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(33,29,24,0.04), 0 6px 18px rgba(33,29,24,0.06)',
        cardHover: '0 2px 4px rgba(33,29,24,0.06), 0 12px 28px rgba(33,29,24,0.10)',
        pin: 'inset 0 1px 0 rgba(255,255,255,0.5)',
      },
      keyframes: {
        checkmark: {
          '0%': { strokeDashoffset: 24 },
          '100%': { strokeDashoffset: 0 },
        },
        popIn: {
          '0%': { opacity: 0, transform: 'translateY(6px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        checkmark: 'checkmark 0.32s ease forwards',
        popIn: 'popIn 0.22s cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}
