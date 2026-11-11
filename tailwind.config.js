/** @type {import('tailwindcss').Config} */
module.exports = {
  // WHERE Tailwind looks for class names. Anything not listed here
  // will NOT get its styles generated!
content: ["./index.html", "./assets/js/**/*.js"],

  theme: {
    extend: {
      // Our own custom colors → usable as bg-brand-600, text-accent-500, etc.
      colors: {
        brand: { 50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',900:'#312e81' },
        accent:{ 400:'#c084fc',500:'#a855f7',600:'#9333ea' }
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: [],
}