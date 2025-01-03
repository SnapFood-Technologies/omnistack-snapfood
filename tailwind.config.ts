import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        transparent: 'transparent',
        background: {
          DEFAULT: '#fafafa',
          darker: '#ededed',
          grey: '#f5f5f5',
        },
        primary: {
          DEFAULT: '#50B7ED',
        },
        secondary: '#32db64',
        text: '#222222',
        placeholder: '#595959',
        gray: {
          1: '#454b4c',
          2: '#6a6a6a',
          3: '#8c9799',
          4: '#737373',
          5: '#d5d4e0',
          6: '#e9e9f7',
          7: '#aaa8bf',
          8: '#fafafc',
          9: '#f6f6f9',
        },
        cyan: {
          1: '#50b7ed',
          2: '#50b7ed',
          3: '#23dee2',
        },
        alert: {
          error: '#cc1c4e',
          success: '#1dd890',
          warning: '#f4e637',
          info: '#109df7',
          neutral: '#7850dd',
        },
      },
      fontFamily: {
        yellix: ['Yellix', 'sans-serif']
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: '0' },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: '0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
}

export default config