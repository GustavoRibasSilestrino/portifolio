/** @type {import('tailwindcss').Config} */
// As cores vêm de variáveis CSS (definidas em src/palettes.js) para o seletor de paletas funcionar.
const c = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'], mono: ['"JetBrains Mono"', 'monospace'] },
      colors: {
        paper: c('bg'),
        card: c('card'),
        ink: c('ink'),
        mid: c('mid'),
        accent: c('accent'),
        bar: c('bar'),
        onbar: c('onbar'),
      },
    },
  },
  plugins: [],
}
