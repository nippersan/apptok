/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        gray: {
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}