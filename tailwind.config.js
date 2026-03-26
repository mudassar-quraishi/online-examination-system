/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0b1326',
        'surface-low': '#131b2e',
        'surface-container': '#171f33',
        'surface-high': '#222a3d',
        'surface-highest': '#2d3449',
        'on-surface': '#dae2fd',
        'on-surface-variant': '#c2c6d6',
        primary: '#c0c1ff',
        'primary-container': '#8083ff',
        secondary: '#adc6ff',
        'secondary-container': '#0566d9',
        tertiary: '#ddb7ff',
        'tertiary-container': '#b76dff',
        outline: '#8c909f',
        'outline-variant': '#424754',
        error: '#ffb4ab',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(192, 193, 255, 0.1)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(192, 193, 255, 0.15)' },
        },
      },
    },
  },
  plugins: [],
}
