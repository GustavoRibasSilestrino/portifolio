// ink = texto/bordas/barras · mid = tom intermediário · bg = fundo da página · card = janelas e cards · accent = destaque
// Cada paleta é definida no modo claro; o modo escuro é derivado dela automaticamente.
export const palettes = [
  { id: 'slate', name: { pt: 'Ardósia e turquesa', en: 'Slate & teal' }, ink: '#1b2430', mid: '#7c9bb5', bg: '#f1f4f7', card: '#fafbfc', accent: '#0e7c86' },
  { id: 'navy', name: { pt: 'Creme e marinho', en: 'Cream & navy' }, ink: '#0b2a4a', mid: '#5f9bbd', bg: '#f6ecd9', card: '#fdf8ee', accent: '#c1121f' },
  { id: 'graphite', name: { pt: 'Grafite e caramelo', en: 'Graphite & caramel' }, ink: '#2b2a28', mid: '#9b958c', bg: '#efece4', card: '#faf8f3', accent: '#b07a45' },
  { id: 'forest', name: { pt: 'Floresta e ferrugem', en: 'Forest & rust' }, ink: '#1f3d2b', mid: '#8cc3a4', bg: '#f3efe3', card: '#fbf9f1', accent: '#c8571f' },
  { id: 'plum', name: { pt: 'Ameixa', en: 'Plum' }, ink: '#2b1a3a', mid: '#a78bc9', bg: '#f6eef4', card: '#fcf7fb', accent: '#8e2f6b' },
  { id: 'olive', name: { pt: 'Areia e oliva', en: 'Sand & olive' }, ink: '#3a3326', mid: '#c9a96e', bg: '#f3ecdc', card: '#fbf7ec', accent: '#6b7a2a' },
  { id: 'gold', name: { pt: 'Meia-noite e ouro', en: 'Midnight & gold' }, ink: '#0d1b4a', mid: '#5aa0e6', bg: '#f4f1e8', card: '#fcfaf4', accent: '#d9a21b' },
  { id: 'rose', name: { pt: 'Rosé', en: 'Rosé' }, ink: '#3a2229', mid: '#e3a5b8', bg: '#fbeff1', card: '#fffafb', accent: '#c2335f' },
  { id: 'paper', name: { pt: 'Papel e tinta', en: 'Paper & ink' }, ink: '#111111', mid: '#8a8a8a', bg: '#f5f5f2', card: '#ffffff', accent: '#333333' },
]

export const defaultPalette = 'slate'
export const defaultMode = 'dark'

const toRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const triplet = (hex) => toRgb(hex).join(' ')

// mistura a com b (t = 0 → a, t = 1 → b)
const mix = (a, b, t) => {
  const A = toRgb(a)
  const B = toRgb(b)
  const h = A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0'))
  return `#${h.join('')}`
}

function colorsFor(p, mode) {
  if (mode === 'light') {
    return { ink: p.ink, mid: p.mid, bg: p.bg, card: p.card, accent: p.accent, bar: p.ink, onbar: p.bg, shadow: p.ink }
  }
  // escuro: fundo e cards saem do tom escuro da paleta; o texto usa o fundo claro dela
  return {
    ink: p.bg,
    mid: p.mid,
    bg: mix(p.ink, '#000000', 0.45),
    card: mix(p.ink, '#000000', 0.15),
    accent: mix(p.accent, '#ffffff', 0.25),
    bar: mix(p.ink, '#ffffff', 0.12),
    onbar: p.bg,
    shadow: '#000000',
  }
}

export function getColors(id, mode) {
  return colorsFor(palettes.find((x) => x.id === id) ?? palettes[0], mode)
}

export function applyPalette(id, mode) {
  const colors = getColors(id, mode)
  const root = document.documentElement.style
  for (const [k, v] of Object.entries(colors)) root.setProperty(`--c-${k}`, triplet(v))
  root.colorScheme = mode
}
