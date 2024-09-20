/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '2560px',
        'xs': '375px',
      },
      colors: {
        'hover-color': '#6961CF',
      },
    },
  },
  plugins: [],
}

