/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'], mono: ['"JetBrains Mono"', 'monospace'] },
      colors: { paper: '#ecebe4', ink: '#1c1c1a', accent: '#1f9d7a' },
    },
  },
  plugins: [],
}
