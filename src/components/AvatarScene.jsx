import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useAnimations, useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Dois jeitos de mostrar o avatar:
// 1) Se existir public/avatar.glb (modelo 3D de verdade), ele é usado.
// 2) Senão, o retrato public/avatar-portrait.webp vira um busto em relevo 3D.
const MODEL_URL = '/avatar.glb'
const PORTRAIT_URL = '/avatar-portrait.webp'
// Se o seu .glb aparecer de costas, mude para Math.PI.
const MODEL_ROTATION_Y = 0
const WAVE_CLIP = /wave|tchau|hello|greet|acen/i
const IDLE_CLIP = /idle|stand|breath|respir/i

// ---------- retrato em relevo ----------
const W = 3 // lado do retrato na cena
const DEPTH = 0.5 // quanto o relevo "salta" para frente
const NECK_V = 0.445 // altura do pescoço (0 = topo da imagem, 1 = base)
const HEAD_END = 0.53 // a peça da cabeça vai até aqui...
const FADE_START = 0.475 // ...e some suavemente entre FADE_START e HEAD_END
const BODY_START = 0.44 // a peça do corpo começa aqui (sobrepõe a base da cabeça)
const GRID = 128

// desfoque de caixa separável (bordas replicadas para a base cortada da imagem não afinar)
function boxBlur(src, n, r) {
  const tmp = new Float32Array(n * n)
  const out = new Float32Array(n * n)
  const size = r * 2 + 1
  const cl = (v) => Math.min(Math.max(v, 0), n - 1)
  for (let y = 0; y < n; y++) {
    let sum = 0
    for (let x = -r; x <= r; x++) sum += src[y * n + cl(x)]
    for (let x = 0; x < n; x++) {
      tmp[y * n + x] = sum / size
      sum += src[y * n + cl(x + r + 1)] - src[y * n + cl(x - r)]
    }
  }
  for (let x = 0; x < n; x++) {
    let sum = 0
    for (let y = -r; y <= r; y++) sum += tmp[cl(y) * n + x]
    for (let y = 0; y < n; y++) {
      out[y * n + x] = sum / size
      sum += tmp[cl(y + r + 1) * n + x] - tmp[cl(y - r) * n + x]
    }
  }
  return out
}

// mapa de altura: silhueta suavizada (cria o "volume") + um realce no rosto para a cabeça saltar do tronco
function buildHeights(image) {
  const c = document.createElement('canvas')
  c.width = c.height = GRID
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(image, 0, 0, GRID, GRID)
  const px = ctx.getImageData(0, 0, GRID, GRID).data
  let a = new Float32Array(GRID * GRID)
  for (let i = 0; i < a.length; i++) a[i] = px[i * 4 + 3] / 255
  for (let k = 0; k < 3; k++) a = boxBlur(a, GRID, 5)
  const h = new Float32Array(GRID * GRID)
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      const u = x / (GRID - 1)
      const v = y / (GRID - 1)
      const face = Math.exp(-(((u - 0.47) / 0.17) ** 2 + ((v - 0.25) / 0.2) ** 2))
      h[y * GRID + x] = Math.pow(a[y * GRID + x], 1.15) * (0.6 + 0.4 * face)
    }
  }
  return h
}

const sampleH = (h, u, v) => {
  const x = Math.min(Math.max(u, 0), 1) * (GRID - 1)
  const y = Math.min(Math.max(v, 0), 1) * (GRID - 1)
  const x0 = Math.floor(x), y0 = Math.floor(y)
  const x1 = Math.min(x0 + 1, GRID - 1), y1 = Math.min(y0 + 1, GRID - 1)
  const fx = x - x0, fy = y - y0
  const top = h[y0 * GRID + x0] * (1 - fx) + h[y0 * GRID + x1] * fx
  const bot = h[y1 * GRID + x0] * (1 - fx) + h[y1 * GRID + x1] * fx
  return top * (1 - fy) + bot * fy
}

const smooth = (a, b, v) => {
  const t = Math.min(Math.max((v - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

// peça do busto entre as alturas v0 e v1 (frações da imagem, de cima para baixo)
function makePart(heights, v0, v1, fadeBottom) {
  const nx = 72
  const ny = Math.max(10, Math.round(72 * (v1 - v0)))
  const pos = new Float32Array((nx + 1) * (ny + 1) * 3)
  const uv = new Float32Array((nx + 1) * (ny + 1) * 2)
  const col = new Float32Array((nx + 1) * (ny + 1) * 4)
  const e = 1 / GRID
  const L = new THREE.Vector3(-0.4, 0.55, 0.75).normalize()
  const n = new THREE.Vector3()
  let k = 0
  for (let j = 0; j <= ny; j++) {
    const v = v0 + ((v1 - v0) * j) / ny
    for (let i = 0; i <= nx; i++) {
      const u = i / nx
      const hh = sampleH(heights, u, v)
      // normal aproximada do relevo, para sombrear a "cúpula"
      const hx = ((sampleH(heights, u + e, v) - sampleH(heights, u - e, v)) * DEPTH) / (2 * e * W)
      const hv = ((sampleH(heights, u, v + e) - sampleH(heights, u, v - e)) * DEPTH) / (2 * e * W)
      n.set(-hx, hv, 1).normalize()
      const shade = Math.min(0.82 + 0.2 * (Math.max(n.dot(L), 0) / L.z), 1.06)
      pos.set([(u - 0.5) * W, (0.5 - v) * W, hh * DEPTH], k * 3)
      uv.set([u, 1 - v], k * 2)
      col.set([shade, shade, shade, fadeBottom ? 1 - smooth(FADE_START, HEAD_END, v) : 1], k * 4)
      k++
    }
  }
  const idx = []
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i
      const b = a + 1
      const c = a + nx + 1
      const d = c + 1
      idx.push(a, c, b, b, c, d)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  g.setAttribute('color', new THREE.BufferAttribute(col, 4))
  g.setIndex(idx)
  return g
}

const lerp = THREE.MathUtils.lerp

function Portrait({ waving, onWave, setHover, mouse }) {
  const tex = useTexture(PORTRAIT_URL)
  const root = useRef()
  const head = useRef()
  const waveT = useRef(0)

  const geos = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    tex.needsUpdate = true
    const heights = buildHeights(tex.image)
    return {
      head: makePart(heights, 0, HEAD_END, true),
      body: makePart(heights, BODY_START, 1, false),
    }
  }, [tex])

  useEffect(
    () => () => {
      geos.head.dispose()
      geos.body.dispose()
    },
    [geos],
  )

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const { x, y } = mouse.current
    waveT.current = waving ? waveT.current + dt : 0
    const w = waving ? Math.sin(waveT.current * 11) * Math.exp(-waveT.current * 0.9) : 0
    const hop = waving ? Math.abs(Math.sin(waveT.current * 7)) * 0.07 * Math.exp(-waveT.current * 1.1) : 0

    // busto inteiro: vira um pouco para o mouse, ancorado na base, e "respira"
    root.current.rotation.y = lerp(root.current.rotation.y, x * 0.32, 0.08)
    root.current.rotation.x = lerp(root.current.rotation.x, -y * 0.1, 0.08)
    root.current.position.y = -W / 2 + hop
    root.current.scale.y = 1 + Math.sin(t * 1.6) * 0.004

    // cabeça: vira e acena com a cabeça no clique
    head.current.rotation.y = lerp(head.current.rotation.y, x * 0.32, 0.1)
    head.current.rotation.x = lerp(head.current.rotation.x, -y * 0.2 + (waving ? Math.sin(waveT.current * 9) * 0.06 : 0), 0.15)
    head.current.rotation.z = lerp(head.current.rotation.z, -x * 0.06 + w * 0.2, 0.3)
  })

  const pivotY = (0.5 - NECK_V) * W
  const mat = (
    <meshBasicMaterial map={tex} vertexColors transparent alphaTest={0.4} />
  )

  return (
    <group
      ref={root}
      position={[0, -W / 2, 0]}
      onClick={onWave}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <group position={[0, W / 2, 0]}>
        <mesh geometry={geos.body} renderOrder={1}>
          {mat}
        </mesh>
        <group ref={head} position={[0, pivotY, 0.002]}>
          <mesh geometry={geos.head} position={[0, -pivotY, 0]} renderOrder={2}>
            {mat}
          </mesh>
        </group>
      </group>
    </group>
  )
}

// ---------- modelo do usuário (public/avatar.glb) ----------
function UserModel({ waving, onWave, setHover }) {
  const group = useRef()
  const gltf = useGLTF(MODEL_URL)
  const { actions, names } = useAnimations(gltf.animations, group)

  // enquadra o modelo: altura fixa e pés no chão
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const size = box.getSize(new THREE.Vector3())
    const scale = 3 / (size.y || 1)
    return { scale, y: -box.min.y * scale - 1.5 }
  }, [gltf.scene])

  const waveName = names.find((n) => WAVE_CLIP.test(n))
  const idleName = names.find((n) => IDLE_CLIP.test(n))

  useEffect(() => {
    if (!idleName) return
    actions[idleName]?.reset().fadeIn(0.2).play()
    return () => {
      actions[idleName]?.fadeOut(0.2)
    }
  }, [actions, idleName])

  useEffect(() => {
    if (!waving) return
    const clip = actions[waveName ?? names[0]]
    if (!clip) return
    clip.reset().setLoop(THREE.LoopOnce, 1)
    clip.clampWhenFinished = true
    clip.fadeIn(0.15).play()
    return () => {
      clip.fadeOut(0.2)
    }
  }, [waving, actions, waveName, names])

  // sem animações no arquivo: um balanço leve ao acenar
  useFrame((state) => {
    if (names.length) return
    group.current.rotation.z = waving ? Math.sin(state.clock.elapsedTime * 14) * 0.06 : 0
  })

  return (
    <group
      ref={group}
      onClick={onWave}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      scale={fit.scale}
      position={[0, fit.y, 0]}
      rotation={[0, MODEL_ROTATION_Y, 0]}
    >
      <primitive object={gltf.scene} />
    </group>
  )
}

// verifica se public/avatar.glb existe (o servidor de dev devolve HTML quando não existe)
function useHasModel() {
  const [has, setHas] = useState(false)
  useEffect(() => {
    let alive = true
    fetch(MODEL_URL, { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') || ''
        if (alive) setHas(r.ok && !type.includes('html'))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])
  return has
}

// o personagem olha para o mouse em qualquer lugar da página
function PointerTracker({ mouse }) {
  const el = useThree((s) => s.gl.domElement)
  useEffect(() => {
    const clamp = (v) => Math.min(Math.max(v, -1), 1)
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height * 0.3
      mouse.current.x = clamp((e.clientX - cx) / (window.innerWidth * 0.5))
      mouse.current.y = clamp(-(e.clientY - cy) / (window.innerHeight * 0.5))
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [el, mouse])
  return null
}

export default function AvatarScene({ waving, onWave }) {
  const [hover, setHover] = useState(false)
  const hasModel = useHasModel()
  const mouse = useRef({ x: 0, y: 0 })

  return (
    <Canvas
      camera={{ position: [0, 0, 4.76], fov: 35 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ cursor: hover ? 'pointer' : 'default' }}
    >
      <PointerTracker mouse={mouse} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <Suspense fallback={null}>
        {hasModel ? (
          <UserModel waving={waving} onWave={onWave} setHover={setHover} />
        ) : (
          <Portrait waving={waving} onWave={onWave} setHover={setHover} mouse={mouse} />
        )}
      </Suspense>
    </Canvas>
  )
}
