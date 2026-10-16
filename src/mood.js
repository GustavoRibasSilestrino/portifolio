import { useEffect, useState } from 'react'

// Tema "Sims": as necessidades e o humor do avatar mudam conforme a hora do dia (fuso de São Paulo).

// Hora atual como número (ex.: 14.5 = 14h30). Para testar, abra o site com ?hora=3 (madrugada), ?hora=9, ?hora=15...
export function currentHour() {
  const forced = new URLSearchParams(window.location.search).get('hora')
  if (forced !== null && forced !== '' && !Number.isNaN(Number(forced))) return ((Number(forced) % 24) + 24) % 24
  const [h, m] = new Date()
    .toLocaleTimeString('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hour12: false })
    .split(':')
    .map(Number)
  return (h % 24) + m / 60
}

// atualiza a cada minuto, para as barras e o humor mudarem sozinhos
export function useHour() {
  const [hour, setHour] = useState(currentHour)
  useEffect(() => {
    const id = setInterval(() => setHour(currentHour()), 60000)
    return () => clearInterval(id)
  }, [])
  return hour
}

// interpolação linear entre pontos [hora, valor]
const curve = (pts, h) => {
  for (let i = 1; i < pts.length; i++) {
    const [h0, v0] = pts[i - 1]
    const [h1, v1] = pts[i]
    if (h <= h1) return v0 + ((v1 - v0) * (h - h0)) / (h1 - h0 || 1)
  }
  return pts[pts.length - 1][1]
}

// Necessidades (0–100) ao longo do dia
export const NEEDS = [
  {
    id: 'cafe',
    label: { pt: 'Café', en: 'Coffee' },
    pts: [[0, 15], [6, 25], [7.5, 95], [11, 55], [13, 30], [14.5, 85], [18, 45], [22, 20], [24, 15]],
  },
  {
    id: 'foco',
    label: { pt: 'Foco', en: 'Focus' },
    pts: [[0, 10], [6, 35], [9, 90], [12, 70], [14, 60], [16, 85], [20, 55], [23, 20], [24, 10]],
  },
  {
    id: 'codigo',
    label: { pt: 'Código', en: 'Code' },
    pts: [[0, 35], [6, 25], [8, 40], [12, 55], [14, 60], [18, 75], [21, 95], [23, 80], [24, 40]],
  },
  {
    id: 'sono',
    label: { pt: 'Sono', en: 'Sleep' },
    pts: [[0, 15], [6, 100], [12, 75], [18, 50], [22, 25], [24, 15]],
  },
]

export const needValue = (need, hour) => Math.round(curve(need.pts, hour))

// cor da barra, como no Sims: verde (bem), amarelo (atenção), vermelho (crítico)
export const needColor = (v) => (v >= 60 ? '#4ade80' : v >= 30 ? '#fbbf24' : '#f87171')

// Humor do avatar. lid = quanto as pálpebras ficam fechadas (0 a 1).
export function moodFor(hour) {
  if (hour < 6) return { id: 'sleepy', label: { pt: 'sonolento', en: 'sleepy' }, lid: 0.5, plumbob: 'amber', zzz: true }
  if (hour < 12) return { id: 'energized', label: { pt: 'animado', en: 'energized' }, lid: 0, plumbob: 'green', bounce: true }
  if (hour < 22) return { id: 'focused', label: { pt: 'focado', en: 'focused' }, lid: 0.06, plumbob: 'green' }
  return { id: 'tired', label: { pt: 'cansado', en: 'tired' }, lid: 0.3, plumbob: 'lime' }
}

// cores do plumbob (diamante do Sims) por humor: [face clara, face média, face escura, brilho]
export const PLUMBOB = {
  green: { a: '#c4ff9a', b: '#62e24f', c: '#26a336', d: '#46c946', glow: '#5cff4a' },
  lime: { a: '#e3ff9a', b: '#b4e84a', c: '#6fa328', d: '#9bd13a', glow: '#c6f55a' },
  amber: { a: '#fff3a8', b: '#ffd447', c: '#d29a1c', d: '#f0b92e', glow: '#ffd447' },
}
