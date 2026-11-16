import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useApp } from '../context'
import { moodFor, PLUMBOB, useHour } from '../mood'
import AvatarRig from './AvatarRig'

// Avatar 2.5D em camadas (veja AvatarRig.jsx), da cintura para cima, com fundo transparente.
// As camadas são recortadas do próprio boneco: o tchau é uma animação de articulações (ombro, cotovelo),
// não um vídeo. O desenho do boneco vem das imagens em /public/avatar.
const SRC = { w: 1110, h: 1410 } // px do recorte de referência (as camadas têm essa proporção)
export const AVATAR_ASPECT = SRC.w / SRC.h // largura / altura
const HEAD = { cx: 617, top: 77, right: 806 } // centro, topo e lado direito da cabeça (px do recorte)
const RIG_H = 762 // altura (px) do sistema de coordenadas das camadas

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
function Plumbob({ palette, scale, cx, bottom }) {
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
      style={{ width: w, height: h, left: cx - w / 2, top: bottom - h }}
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

// Avatar (da cintura para cima): respira, acompanha o mouse com o corpo e acena quando clicado.
// No estilo Sims: plumbob e humor que muda com a hora do dia.
// `size` é a ALTURA do avatar na tela (px); a largura segue a proporção da imagem.
export default function Avatar({ size = 440 }) {
  const S = size
  const Wd = S * AVATAR_ASPECT
  const k = S / SRC.h // escala da imagem para a tela
  const fx = S / 600 // escala dos enfeites (plumbob e "zzz")
  const { t } = useApp()
  const mood = moodFor(useHour())
  const [hop, setHop] = useState(false)
  const box = useRef(null)
  const rig = useRef(null)

  // mouse normalizado (-1..1) em relação ao avatar: o corpo se inclina de leve para o lado do cursor
  const mx = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 18 })
  const lean = useTransform(sx, (v) => v * 1.6)
  const shift = useTransform(sx, (v) => v * 7 * fx)

  useEffect(() => {
    const clamp = (v) => Math.min(Math.max(v, -1), 1)
    const move = (e) => {
      const r = box.current?.getBoundingClientRect()
      if (!r) return
      mx.set(clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.5)))
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [mx])

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

  const doWave = () => rig.current?.wave() // já acenando? o rig ignora o clique

  const plumbobBottom = (HEAD.top - 8) * k

  return (
    <div className="relative" style={{ width: Wd, height: S }}>
      <motion.div
        ref={box}
        role="button"
        tabIndex={0}
        aria-label={t({ pt: 'Avatar do Gustavo: clique para acenar', en: "Gustavo's avatar: click to wave" })}
        title={t({ pt: 'Clique para acenar', en: 'Click to wave' })}
        className="absolute inset-0 select-none outline-none"
        onClick={doWave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            doWave()
          }
        }}
        animate={hop ? { y: [0, -10, 0, -4, 0] } : { y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <motion.div className="absolute inset-0" style={{ x: shift, rotate: lean, transformOrigin: '50% 100%' }}>
          <Plumbob palette={mood.plumbob} scale={fx} cx={HEAD.cx * k} bottom={plumbobBottom} />
          {mood.zzz && <Zzz left={(HEAD.right + 6) * k} top={(HEAD.top + 70) * k} scale={fx} />}

          {/* respiração: o conjunto todo cresce um tiquinho a partir da base */}
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: '50% 100%' }}
            animate={{ scaleY: [1, 1.006, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AvatarRig ref={rig} k={S / RIG_H} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
