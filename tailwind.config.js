/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        nexus: {
          dark: '#030712',
          navy: '#060f1e',
          blue: '#0ea5e9',
          cyan: '#06b6d4',
          violet: '#7c3aed',
          electric: '#3b82f6',
          glow: '#38bdf8',
        }
      },
    },
  },
  plugins: [],
}
