import { Component, lazy, Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../context'
import { getColors } from '../palettes'
import { ui } from '../data'

// A cena 3D (three.js) é pesada: só carrega depois do resto da página.
const AvatarScene = lazy(() => import('./AvatarScene'))

// Rosto do avatar (usado como foto de perfil na janela "Sobre mim").
export function Face({ className = '' }) {
  return (
    <svg viewBox="40 30 110 130" className={className} aria-hidden="true">
      <path d="M45 170 V170 Q45 140 95 140 Q145 140 145 170 Z" className="fill-accent stroke-ink" strokeWidth="4" />
      <rect x="82" y="120" width="26" height="26" fill="#f1c9a5" className="stroke-ink" strokeWidth="4" />
      <circle cx="95" cy="85" r="44" fill="#f1c9a5" className="stroke-ink" strokeWidth="4" />
      <path d="M51 80 Q50 36 95 38 Q140 36 139 80 Q120 58 95 60 Q70 58 51 80 Z" fill="#2b1d14" className="stroke-ink" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="78" cy="88" r="5" className="fill-ink" />
      <circle cx="112" cy="88" r="5" className="fill-ink" />
      <path d="M80 106 Q95 120 110 106" className="stroke-ink" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Boneco 2D: aparece enquanto o 3D carrega e se o navegador não suportar WebGL.
function Avatar2D({ waving, onWave, label }) {
  return (
    <motion.button
      onClick={onWave}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      aria-label={label}
      className="cursor-pointer"
    >
      <svg width="190" height="230" viewBox="0 0 190 230">
        <path d="M45 230 V170 Q45 140 95 140 Q145 140 145 170 V230 Z" className="fill-accent stroke-ink" strokeWidth="4" />
        <path d="M48 160 Q30 190 40 215" className="stroke-ink" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="82" y="120" width="26" height="26" fill="#f1c9a5" className="stroke-ink" strokeWidth="4" />
        <circle cx="95" cy="85" r="44" fill="#f1c9a5" className="stroke-ink" strokeWidth="4" />
        <path d="M51 80 Q50 36 95 38 Q140 36 139 80 Q120 58 95 60 Q70 58 51 80 Z" fill="#2b1d14" className="stroke-ink" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="78" cy="88" r="5" className="fill-ink" />
        <circle cx="112" cy="88" r="5" className="fill-ink" />
        <path d="M80 106 Q95 120 110 106" className="stroke-ink" strokeWidth="4" fill="none" strokeLinecap="round" />
        <motion.g
          style={{ originX: '143px', originY: '160px', transformBox: 'view-box' }}
          animate={waving ? { rotate: [0, -50, -20, -50, -20, -50, 0] } : { rotate: 0 }}
          transition={{ duration: 1.5 }}
        >
          <path d="M143 160 Q165 170 160 205" className="stroke-ink" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="160" cy="210" r="11" fill="#f1c9a5" className="stroke-ink" strokeWidth="4" />
        </motion.g>
      </svg>
    </motion.button>
  )
}

// Se o 3D falhar (ex.: sem WebGL), cai no boneco 2D em vez de quebrar o site.
class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

export default function Avatar() {
  const { t, palette, mode } = useApp()
  const [waving, setWaving] = useState(false)
  const shirt = getColors(palette, mode).accent

  const wave = () => {
    if (waving) return
    setWaving(true)
    setTimeout(() => setWaving(false), 1600)
  }

  const fallback = <Avatar2D waving={waving} onWave={wave} label={t(ui.clickMe)} />

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {waving && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="box absolute -top-8 z-10 whitespace-nowrap px-3 py-1 text-xs"
          >
            {t(ui.wave)}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[300px] w-[320px]">
        <Boundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <AvatarScene waving={waving} onWave={wave} shirt={shirt} />
          </Suspense>
        </Boundary>
      </div>
      <span className="text-[10px] opacity-60">{t(ui.clickMe)}</span>
    </div>
  )
}
