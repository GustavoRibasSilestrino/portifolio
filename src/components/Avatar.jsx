import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useApp } from '../context'
import { ui } from '../data'
import { moodFor, PLUMBOB, useHour } from '../mood'

const PORTRAIT = '/avatar-portrait.webp'

// Divisão do busto em duas camadas, para a cabeça virar sozinha sobre o pescoço (frações da altura da imagem).
const BODY_START = 0.445
const NECK = 0.46
const HEAD_END = 0.525

// Olhos, para a piscada (frações da imagem)
const EYES = [
  { x: 0.431, y: 0.258 },
  { x: 0.559, y: 0.258 },
]
const SKIN = '#cd724e'
const SKIN_DARK = '#a85a3a'

// Foto de perfil da janela "Sobre mim": rosto recortado da foto real.
export function Face({ className = '' }) {
  return (
    <div
      role="img"
      aria-label="Gustavo"
      className={className}
      style={{
        backgroundImage: 'url(/profile.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  )
}

function Hand() {
  return (
    <svg viewBox="0 0 100 140" width="84" height="118" aria-hidden="true">
      <defs>
        <linearGradient id="hand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e08a60" />
          <stop offset="1" stopColor={SKIN} />
        </linearGradient>
      </defs>
      <g fill="url(#hand)" stroke={SKIN_DARK} strokeWidth="2.5" strokeLinejoin="round">
        <rect x="35" y="100" width="30" height="45" rx="8" />
        <rect x="27" y="14" width="13" height="56" rx="6.5" />
        <rect x="41" y="6" width="13" height="64" rx="6.5" />
        <rect x="55" y="12" width="13" height="58" rx="6.5" />
        <rect x="68" y="26" width="12" height="46" rx="6" />
        <rect x="9" y="58" width="18" height="44" rx="9" transform="rotate(-32 18 80)" />
        <rect x="24" y="54" width="56" height="58" rx="20" />
      </g>
    </svg>
  )
}

// Plumbob: o diamante do Sims. Gira em 3D (dois planos cruzados), flutua e brilha; a cor muda com o humor.
function Plumbob({ palette, size, x, y }) {
  const c = PLUMBOB[palette]
  const w = size * 0.085
  const h = size * 0.16
  const faces = (
    <svg viewBox="0 0 60 100" width="100%" height="100%" aria-hidden="true">
      <polygon points="30,0 6,48 30,58" fill={c.a} />
      <polygon points="30,0 54,48 30,58" fill={c.b} />
      <polygon points="30,100 6,48 30,58" fill={c.c} />
      <polygon points="30,100 54,48 30,58" fill={c.d} />
    </svg>
  )
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2"
      style={{ x, y, width: w, height: h, top: -h - size * 0.015, marginLeft: -w / 2 }}
    >
      <motion.div
        className="h-full w-full"
        style={{ filter: `drop-shadow(0 0 ${size * 0.03}px ${c.glow})` }}
        animate={{ y: [0, -size * 0.02, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="h-full w-full" style={{ perspective: 400 }}>
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0">{faces}</div>
            <div className="absolute inset-0" style={{ transform: 'rotateY(90deg)' }}>
              {faces}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// "z z z" subindo, quando o avatar está sonolento (madrugada)
function Zzz({ size }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: size * 0.64, top: size * 0.02 }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute font-display font-bold"
          style={{ fontSize: size * (0.045 + 0.016 * i), left: i * size * 0.035, top: -i * size * 0.05, color: 'rgb(var(--c-ink))' }}
          animate={{ opacity: [0, 0.85, 0], y: [4, -10] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.55 }}
        >
          z
        </motion.span>
      ))}
    </div>
  )
}

// Avatar 2D animado: a cabeça acompanha o mouse, o corpo respira, os olhos piscam e, ao clicar,
// ele balança a cabeça e acena com a mão. No estilo Sims: tem plumbob e humor que muda com a hora.
export default function Avatar({ size = 340 }) {
  const S = size // lado do avatar na tela (px)
  const { t } = useApp()
  const mood = moodFor(useHour())
  const [waving, setWaving] = useState(false)
  const [hop, setHop] = useState(false)
  const [blink, setBlink] = useState(false)
  const box = useRef(null)

  // mouse normalizado (-1..1) em relação ao avatar
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 110, damping: 16 })
  const sy = useSpring(my, { stiffness: 110, damping: 16 })
  const headX = useTransform(sx, (v) => v * 7)
  const headY = useTransform(sy, (v) => v * 4)
  const headRot = useTransform(sx, (v) => v * 4)
  const bodyX = useTransform(sx, (v) => v * -2)

  useEffect(() => {
    const clamp = (v) => Math.min(Math.max(v, -1), 1)
    const move = (e) => {
      const r = box.current?.getBoundingClientRect()
      if (!r) return
      mx.set(clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5)))
      my.set(clamp((e.clientY - (r.top + r.height * 0.3)) / (window.innerHeight * 0.5)))
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [mx, my])

  // piscadas em intervalos irregulares (sonolento: mais lentas e mais frequentes)
  const sleepy = mood.id === 'sleepy'
  useEffect(() => {
    let timer
    let off
    const loop = () => {
      timer = setTimeout(
        () => {
          setBlink(true)
          off = setTimeout(() => setBlink(false), sleepy ? 380 : 140)
          loop()
        },
        sleepy ? 1600 + Math.random() * 1800 : 2200 + Math.random() * 3400,
      )
    }
    loop()
    return () => {
      clearTimeout(timer)
      clearTimeout(off)
    }
  }, [sleepy])

  // animado (manhã): um pulinho de vez em quando
  useEffect(() => {
    if (!mood.bounce) return
    let off
    const id = setInterval(() => {
      setHop(true)
      off = setTimeout(() => setHop(false), 800)
    }, 7000)
    return () => {
      clearInterval(id)
      clearTimeout(off)
    }
  }, [mood.bounce])

  const wave = () => {
    if (waving) return
    setWaving(true)
    setTimeout(() => setWaving(false), 1900)
  }

  return (
    <div className="relative" style={{ width: S, height: S }}>
      {/* balão de fala, acima do plumbob */}
      <div className="absolute left-1/2 z-10 -translate-x-1/2" style={{ top: -S * 0.27 }}>
        <AnimatePresence>
          {waving && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="box whitespace-nowrap px-3 py-1 text-xs [--depth:4px]"
            >
              {t(ui.wave)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Plumbob palette={mood.plumbob} size={S} x={headX} y={headY} />
      {mood.zzz && <Zzz size={S} />}

      <motion.button
        ref={box}
        onClick={wave}
        aria-label={t(ui.clickMe)}
        className="absolute inset-0 select-none"
        animate={waving ? { y: [0, -10, 0, -5, 0] } : hop ? { y: [0, -8, 0, -3, 0] } : { y: 0 }}
        transition={{ duration: 0.9 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* corpo (de abaixo do queixo para baixo), respira */}
        <motion.div
          className="absolute left-0 w-full overflow-hidden"
          style={{ top: S * BODY_START, height: S * (1 - BODY_START), x: bodyX, transformOrigin: '50% 100%' }}
          animate={{ scaleY: [1, 1.008, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={PORTRAIT}
            alt=""
            draggable={false}
            className="pointer-events-none absolute left-0 max-w-none"
            style={{ top: -S * BODY_START, width: S, height: S }}
          />
        </motion.div>

        {/* cabeça: gira sobre o pescoço; a base some suavemente para não aparecer emenda */}
        <motion.div
          className="absolute left-0 top-0 w-full overflow-hidden"
          style={{
            height: S * HEAD_END,
            x: headX,
            y: headY,
            rotate: headRot,
            transformOrigin: `50% ${(NECK / HEAD_END) * 100}%`,
            WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 86%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, #000 0%, #000 86%, transparent 100%)',
          }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{ transformOrigin: `50% ${(NECK / HEAD_END) * 100}%` }}
            animate={waving ? { rotate: [0, -6, 6, -6, 6, -3, 0] } : { rotate: 0 }}
            transition={{ duration: 1.4 }}
          >
            <img
              src={PORTRAIT}
              alt=""
              draggable={false}
              className="pointer-events-none absolute left-0 top-0 max-w-none"
              style={{ width: S, height: S }}
            />
            {EYES.map((e, i) => (
              <div
                key={i}
                className="pointer-events-none absolute rounded-[50%]"
                style={{
                  left: e.x * S - S * 0.033,
                  top: e.y * S - S * 0.017,
                  width: S * 0.066,
                  height: S * 0.034,
                  background: SKIN,
                  boxShadow: 'inset 0 -1.5px 0 rgba(70,28,16,.75)',
                  transformOrigin: '50% 0%',
                  // pálpebra: fechada na piscada; no resto do tempo depende do humor (sonolento = meio fechada)
                  transform: `scaleY(${blink ? 1 : mood.lid})`,
                  transition: `transform ${sleepy ? 220 : 70}ms ease-out`,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* mão acenando */}
        <AnimatePresence>
          {waving && (
            <motion.div
              key="hand"
              className="pointer-events-none absolute"
              style={{ right: 6 * (S / 340), bottom: -14 * (S / 340), transformOrigin: '50% 100%' }}
              initial={{ y: 110, opacity: 0 }}
              animate={{ y: 0, opacity: 1, rotate: [0, -16, 16, -16, 16, -10, 0] }}
              exit={{ y: 110, opacity: 0 }}
              transition={{ y: { duration: 0.28 }, opacity: { duration: 0.2 }, rotate: { duration: 1.2, delay: 0.25 } }}
            >
              {/* a mão cresce junto com o avatar */}
              <div style={{ transform: `scale(${S / 340})`, transformOrigin: '50% 100%' }}>
                <Hand />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
