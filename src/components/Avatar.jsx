import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useApp } from '../context'
import { ui } from '../data'
import { moodFor, PLUMBOB, useHour } from '../mood'

// Camadas do avatar 3D (todas com 420×660 px e o mesmo enquadramento):
//  head.webp       cabeça + pescoço (acompanha o mouse)
//  body-rest.webp  corpo com os dois braços para baixo
//  body-wave.webp  corpo com o braço levantado (sem antebraço e mão)
//  forearm.webp    antebraço + mão (balança no cotovelo no tchau)
const SRC = { w: 420, h: 660 }
export const AVATAR_ASPECT = SRC.w / SRC.h // largura / altura
const HEAD = { cx: 233, top: 22, neckY: 205 } // centro, topo da cabeça e pescoço (px das camadas)
const ELBOW = { x: 45, y: 235 } // ponto de giro do antebraço
const LAYER = (name) => `/avatar/${name}.webp`

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

// Plumbob: o diamante do Sims. Gira em 3D (dois planos cruzados), flutua e brilha; a cor muda com o humor.
function Plumbob({ palette, scale, cx, bottom, x, y }) {
  const c = PLUMBOB[palette]
  const h = 78 * scale
  const w = 42 * scale
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
      className="pointer-events-none absolute"
      style={{ x, y, width: w, height: h, left: cx - w / 2, top: bottom - h }}
    >
      <motion.div
        className="h-full w-full"
        style={{ filter: `drop-shadow(0 0 ${14 * scale}px ${c.glow})` }}
        animate={{ y: [0, -12 * scale, 0] }}
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
function Zzz({ left, top, scale }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute" style={{ left, top }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute font-display font-bold"
          style={{
            fontSize: (22 + 8 * i) * scale,
            left: i * 18 * scale,
            top: -i * 26 * scale,
            color: 'rgb(var(--c-ink))',
          }}
          animate={{ opacity: [0, 0.85, 0], y: [4, -10] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.55 }}
        >
          z
        </motion.span>
      ))}
    </div>
  )
}

// Avatar 3D em camadas: a cabeça acompanha o mouse, o corpo respira e, ao clicar, o braço sobe e
// balança no cotovelo (tchau). No estilo Sims: plumbob e humor que muda com a hora do dia.
// `size` é a ALTURA do avatar na tela (px); a largura segue a proporção das camadas.
export default function Avatar({ size = 540 }) {
  const S = size
  const Wd = S * AVATAR_ASPECT
  const k = S / SRC.h // escala das camadas para a tela
  const { t } = useApp()
  const mood = moodFor(useHour())
  const [waving, setWaving] = useState(false)
  const [hop, setHop] = useState(false)
  const box = useRef(null)

  // mouse normalizado (-1..1) em relação ao avatar
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 110, damping: 16 })
  const sy = useSpring(my, { stiffness: 110, damping: 16 })
  const headX = useTransform(sx, (v) => v * 5 * k * 1.4)
  const headY = useTransform(sy, (v) => v * 3 * k * 1.4)
  const headRot = useTransform(sx, (v) => v * 3)

  useEffect(() => {
    const clamp = (v) => Math.min(Math.max(v, -1), 1)
    const move = (e) => {
      const r = box.current?.getBoundingClientRect()
      if (!r) return
      mx.set(clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5)))
      my.set(clamp((e.clientY - (r.top + r.height * 0.15)) / (window.innerHeight * 0.5)))
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [mx, my])

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
    setTimeout(() => setWaving(false), 2100)
  }

  const headOrigin = `${(HEAD.cx / SRC.w) * 100}% ${(HEAD.neckY / SRC.h) * 100}%`
  const elbowOrigin = `${(ELBOW.x / SRC.w) * 100}% ${(ELBOW.y / SRC.h) * 100}%`
  const plumbobBottom = (HEAD.top - 12) * k
  const fade = { transition: 'opacity 150ms ease-out' }
  const layer = 'pointer-events-none absolute inset-0 h-full w-full select-none'

  return (
    <div className="relative" style={{ width: Wd, height: S }}>
      {/* balão de fala, acima do plumbob */}
      <div
        className="absolute z-10 -translate-x-1/2"
        style={{ left: HEAD.cx * k, top: plumbobBottom - 78 * k - 46 }}
      >
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

      <Plumbob palette={mood.plumbob} scale={k} cx={HEAD.cx * k} bottom={plumbobBottom} x={headX} y={headY} />
      {mood.zzz && <Zzz left={(HEAD.cx + 62) * k} top={HEAD.top * k + 14 * k} scale={k} />}

      <motion.button
        ref={box}
        onClick={wave}
        aria-label={t(ui.clickMe)}
        className="absolute inset-0 select-none"
        animate={hop && !waving ? { y: [0, -10, 0, -4, 0] } : { y: 0 }}
        transition={{ duration: 0.9 }}
        whileTap={{ scale: 0.995 }}
      >
        {/* respiração: o conjunto todo cresce um tiquinho a partir da base */}
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: '50% 100%' }}
          animate={{ scaleY: [1, 1.006, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* braços para baixo (repouso) */}
          <img src={LAYER('body-rest')} alt="" draggable={false} className={layer} style={{ opacity: waving ? 0 : 1, ...fade }} />

          {/* braço levantado: corpo + antebraço que balança no cotovelo */}
          <img src={LAYER('body-wave')} alt="" draggable={false} className={layer} style={{ opacity: waving ? 1 : 0, ...fade }} />
          <motion.img
            src={LAYER('forearm')}
            alt=""
            draggable={false}
            className={layer}
            style={{ transformOrigin: elbowOrigin, opacity: waving ? 1 : 0, ...fade }}
            animate={waving ? { rotate: [0, -16, 14, -16, 14, -16, 12, -6, 0] } : { rotate: 0 }}
            transition={{ duration: 1.8, delay: waving ? 0.15 : 0, ease: 'easeInOut' }}
          />

          {/* cabeça: gira sobre o pescoço seguindo o mouse e balança no tchau */}
          <motion.div className="absolute inset-0" style={{ x: headX, y: headY, rotate: headRot, transformOrigin: headOrigin }}>
            <motion.img
              src={LAYER('head')}
              alt=""
              draggable={false}
              className={layer}
              style={{ transformOrigin: headOrigin }}
              animate={waving ? { rotate: [0, -4, 4, -4, 4, -2, 0] } : { rotate: 0 }}
              transition={{ duration: 1.6 }}
            />
          </motion.div>
        </motion.div>
      </motion.button>
    </div>
  )
}
