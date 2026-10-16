import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useApp } from '../context'
import { moodFor, PLUMBOB, useHour } from '../mood'

// Camadas do avatar 3D, da cintura para cima (as duas com 370×470 px e o mesmo enquadramento):
//  head.webp       cabeça + pescoço (acompanha o mouse)
//  body-rest.webp  corpo com os braços para baixo
const SRC = { w: 370, h: 470 }
export const AVATAR_ASPECT = SRC.w / SRC.h // largura / altura
const HEAD = { cx: 185, top: 10, neckY: 193 } // centro, topo da cabeça e pescoço (px das camadas)
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

// Avatar 3D em camadas (da cintura para cima): a cabeça acompanha o mouse e o corpo respira.
// No estilo Sims: plumbob e humor que muda com a hora do dia.
// `size` é a ALTURA do avatar na tela (px); a largura segue a proporção das camadas.
export default function Avatar({ size = 440 }) {
  const S = size
  const Wd = S * AVATAR_ASPECT
  const k = S / SRC.h // escala das camadas para a tela
  const fx = S / 600 // escala dos enfeites (plumbob e "zzz")
  const { t } = useApp()
  const mood = moodFor(useHour())
  const [hop, setHop] = useState(false)
  const box = useRef(null)

  // mouse normalizado (-1..1) em relação ao avatar
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 110, damping: 16 })
  const sy = useSpring(my, { stiffness: 110, damping: 16 })
  const headX = useTransform(sx, (v) => v * 6 * k)
  const headY = useTransform(sy, (v) => v * 4 * k)
  const headRot = useTransform(sx, (v) => v * 3)

  useEffect(() => {
    const clamp = (v) => Math.min(Math.max(v, -1), 1)
    const move = (e) => {
      const r = box.current?.getBoundingClientRect()
      if (!r) return
      mx.set(clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5)))
      my.set(clamp((e.clientY - (r.top + r.height * 0.2)) / (window.innerHeight * 0.5)))
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

  const headOrigin = `${(HEAD.cx / SRC.w) * 100}% ${(HEAD.neckY / SRC.h) * 100}%`
  const plumbobBottom = (HEAD.top - 4) * k
  const layer = 'pointer-events-none absolute inset-0 h-full w-full select-none'

  return (
    <div className="relative" style={{ width: Wd, height: S }}>
      <Plumbob palette={mood.plumbob} scale={fx} cx={HEAD.cx * k} bottom={plumbobBottom} x={headX} y={headY} />
      {mood.zzz && <Zzz left={(HEAD.cx + 78) * k} top={(HEAD.top + 22) * k} scale={fx} />}

      <motion.div
        ref={box}
        role="img"
        aria-label={t({ pt: 'Avatar do Gustavo', en: "Gustavo's avatar" })}
        className="absolute inset-0 select-none"
        animate={hop ? { y: [0, -10, 0, -4, 0] } : { y: 0 }}
        transition={{ duration: 0.9 }}
      >
        {/* respiração: o conjunto todo cresce um tiquinho a partir da base */}
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: '50% 100%' }}
          animate={{ scaleY: [1, 1.006, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src={LAYER('body-rest')} alt="" draggable={false} className={layer} />

          {/* cabeça: gira sobre o pescoço seguindo o mouse */}
          <motion.div className="absolute inset-0" style={{ x: headX, y: headY, rotate: headRot, transformOrigin: headOrigin }}>
            <img src={LAYER('head')} alt="" draggable={false} className={layer} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
