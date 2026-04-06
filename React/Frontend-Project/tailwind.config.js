/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#f3f4f6',
          darkBg: '#111827',
          card: '#ffffff',
          darkCard: '#1f2937',
          primary: '#3b82f6',
          secondary: '#64748b',
        }
      }
    },
  },
  plugins: [],
}
