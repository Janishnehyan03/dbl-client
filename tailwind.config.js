/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      animation: {
        animation: {
          'fade-in-and-up': 'fadeInUp 1s ease-in-out forwards',
        },
        keyframes: {
          fadeInUp: {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        },
      },
      colors: {
        primary: {
          50: "#e6fffa",
          100: "#b2f5ea",
          200: "#81e6d9",
          300: "#4fd1c5",
          400: "#38b2ac",
          500: "#319795",
          600: "#2c7a7b",
          700: "#285e61",
          800: "#234e52",
          900: "#1d4044",
          950: "#153e3e"
        },
        secondary: {
          50: "#fff5f7",
          100: "#fed7e2",
          200: "#fbb6ce",
          300: "#f687b3",
          400: "#ed64a6",
          500: "#d53f8c",
          600: "#b83280",
          700: "#97266d",
          800: "#702459",
          900: "#521b41",
          950: "#3b0a2e"
        },
        neutral: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712"
        }
      }
    }
  },
  plugins: [],
};
