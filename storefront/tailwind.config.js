/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#955220',
        'brand-secondary': '#f4e08e',
        'brand-accent1': '#e4d897',
        'brand-accent2': '#d4d0a0',
        'brand-accent3': '#c5c9aa',
      },
    },
  },
  plugins: [],
}
