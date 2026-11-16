import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

// Boneco 2.5D em camadas, feito com os pixels do próprio avatar (nada de vídeo):
//  body       corpo e cabeça (o idle.webp sem o braço direito do boneco, o da esquerda da tela)
//  arm-idle   o braço pendurado (o pedaço que saiu do idle.webp)
//  arm-up     braço levantado + ombro (recortado do quadro do tchau), gira em torno do ombro
//  arm-fore   antebraço + mão aberta, gira em torno do cotovelo (é o que balança no tchau)
//  face-smile o rosto sorrindo, que aparece por cima do rosto neutro
// Posições e tamanhos (px) estão no sistema do idle.webp original (600×762); `k` converte para a tela.
// Os arquivos são gerados por um script de recorte: se trocar a imagem, é preciso gerar de novo.
const L = {
  body: { src: '/avatar/body.webp', x: 150, y: 37, w: 433, h: 727 },
  armIdle: { src: '/avatar/arm-idle.webp', x: 87, y: 383, w: 119, h: 381 },
  armUp: { src: '/avatar/arm-up.webp', x: -34, y: 359, w: 268, h: 241 },
  armFore: { src: '/avatar/arm-fore.webp', x: -38, y: 58, w: 203, h: 408 },
  face: { src: '/avatar/face-smile.webp', x: 233, y: 109, w: 191, h: 238 },
}
const SHOULDER = [175, 440] // eixo de giro do ombro
const ELBOW = [20, 413] // eixo de giro do cotovelo

// tempos do tchau (s): sobe, balança a mão, desce
const RAISE = 0.6
const WAVE = 2.4
const LOWER = 0.65
const ROCK = [0, 1, -1, 1, -1, 1, -1, 0] // vaivém da mão (quatro idas e voltas)
const ROCK_DEG = 16

const ss = (a, b, v) => {
  const t = Math.min(Math.max((v - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

// ref.wave(): toca o tchau (ignora se já estiver acenando)
const AvatarRig = forwardRef(function AvatarRig({ k }, ref) {
  const q = useMotionValue(0) // 0 = braço pendurado, 1 = braço levantado
  const rock = useMotionValue(0) // -1..1: vaivém da mão
  const busy = useRef(false)
  const dead = useRef(false)
  const running = useRef(null)

  // 1) o braço do idle sobe reto, girando em torno do ombro;
  // 2) no meio da subida o braço do tchau (também reto, no mesmo ângulo) assume no lugar dele;
  // 3) só então o cotovelo dobra e o antebraço fica na vertical
  const idleAngle = useTransform(q, (v) => 90 * v)
  const idleOpacity = useTransform(q, (v) => 1 - ss(0.36, 0.5, v))
  // a imagem do idle é cortada na cintura, então a ponta da manga é reta: ao girar, ela se desfaz em degradê
  const idleMask = useTransform(q, (v) => `linear-gradient(to bottom, #000 ${100 - 40 * ss(0, 0.12, v)}%, transparent 100%)`)
  const upAngle = useTransform(q, (v) => -90 * (1 - v))
  const upOpacity = useTransform(q, (v) => ss(0.28, 0.44, v))
  const foreAngle = useTransform([q, rock], ([v, r]) => -90 * (1 - ss(0.45, 1, v)) + ROCK_DEG * r)
  const faceOpacity = useTransform(q, (v) => ss(0.3, 0.9, v))

  useEffect(() => {
    dead.current = false
    return () => {
      dead.current = true
      running.current?.stop()
    }
  }, [])

  useImperativeHandle(ref, () => ({
    async wave() {
      if (busy.current) return
      busy.current = true
      const step = async (target, to, options) => {
        if (dead.current) return
        running.current = animate(target, to, options)
        await running.current
      }
      try {
        await step(q, 1, { duration: RAISE, ease: [0.22, 1, 0.36, 1] })
        await step(rock, ROCK, { duration: WAVE, ease: 'easeInOut' })
        await step(q, 0, { duration: LOWER, ease: 'easeInOut' })
      } finally {
        q.set(0)
        rock.set(0)
        busy.current = false
      }
    },
  }))

  const px = (v) => v * k
  const box = (l) => ({ left: px(l.x), top: px(l.y), width: px(l.w), height: px(l.h) })
  const img = (l) => (
    <img src={l.src} alt="" draggable={false} className="pointer-events-none absolute select-none" style={box(l)} />
  )
  const origin = (p) => `${px(p[0])}px ${px(p[1])}px`
  const layer = 'pointer-events-none absolute inset-0'

  return (
    // o braço pode passar das bordas de cima e dos lados, mas nada aparece abaixo da base do avatar
    <div className={layer} style={{ clipPath: 'inset(-40% -40% 0 -40%)' }}>
      {img(L.body)}
      <motion.div className={layer} style={{ rotate: idleAngle, opacity: idleOpacity, transformOrigin: origin(SHOULDER) }}>
        <motion.div
          className="pointer-events-none absolute"
          style={{ ...box(L.armIdle), maskImage: idleMask, WebkitMaskImage: idleMask }}
        >
          <img src={L.armIdle.src} alt="" draggable={false} className="h-full w-full select-none" />
        </motion.div>
      </motion.div>
      <motion.div className={layer} style={{ rotate: upAngle, opacity: upOpacity, transformOrigin: origin(SHOULDER) }}>
        {img(L.armUp)}
        <motion.div className={layer} style={{ rotate: foreAngle, transformOrigin: origin(ELBOW) }}>
          {img(L.armFore)}
        </motion.div>
      </motion.div>
      <motion.div className={layer} style={{ opacity: faceOpacity }}>
        {img(L.face)}
      </motion.div>
    </div>
  )
})

export default AvatarRig
