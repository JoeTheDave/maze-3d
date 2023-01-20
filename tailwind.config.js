/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Permanent Marker', cursive"],
      },
    },
  },
  plugins: [require('daisyui')],
}
