import { useEffect, useRef } from 'react'
import { useApp } from '../context'
import { getColors } from '../palettes'

const LIFE = 650 // quanto tempo (ms) o rastro leva para sumir
const MAX_WIDTH = 9

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Rastro do cursor na cor de destaque do tema. Fica atrás das janelas e não captura cliques.
export default function CursorTrail() {
  const { palette, mode } = useApp()
  const canvas = useRef(null)
  const color = useRef([31, 157, 122])

  // a cor acompanha a paleta e o tema (claro/escuro)
  useEffect(() => {
    color.current = hexToRgb(getColors(palette, mode).accent)
  }, [palette, mode])

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    // sem rastro em telas de toque ou para quem prefere menos animação
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const ctx = el.getContext('2d')
    let points = []
    let raf = 0
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      el.width = Math.floor(el.clientWidth * dpr)
      el.height = Math.floor(el.clientHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const add = (x, y) => {
      const now = performance.now()
      const last = points[points.length - 1]
      if (last) {
        // se o mouse "pulou", preenche o caminho para a linha não ficar quebrada
        const dx = x - last.x
        const dy = y - last.y
        const steps = Math.min(Math.floor(Math.hypot(dx, dy) / 12), 12)
        for (let i = 1; i <= steps; i++) {
          points.push({ x: last.x + (dx * i) / (steps + 1), y: last.y + (dy * i) / (steps + 1), t: now })
        }
      }
      points.push({ x, y, t: now })
      if (!raf) raf = requestAnimationFrame(draw)
    }

    const draw = () => {
      const now = performance.now()
      points = points.filter((p) => now - p.t < LIFE)
      ctx.clearRect(0, 0, el.clientWidth, el.clientHeight)
      const [r, g, b] = color.current
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]
        const p = points[i]
        const life = 1 - (now - p.t) / LIFE // 1 = recém-criado, 0 = sumindo
        const grow = i / points.length // pontas antigas ficam mais finas
        // halo suave + núcleo mais forte
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.18 * life})`
        ctx.lineWidth = (MAX_WIDTH + 8) * life * grow + 1
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.7 * life})`
        ctx.lineWidth = MAX_WIDTH * life * grow + 0.5
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
      raf = points.length ? requestAnimationFrame(draw) : 0
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      add(e.clientX - r.left, e.clientY - r.top)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[calc(100%-44px)] w-full"
    />
  )
}
