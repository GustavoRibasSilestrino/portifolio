import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Para usar o SEU modelo 3D: coloque o arquivo em public/avatar.glb.
// Se ele aparecer de costas, ajuste MODEL_ROTATION_Y para Math.PI.
const MODEL_URL = '/avatar.glb'
const MODEL_ROTATION_Y = 0
const WAVE_CLIP = /wave|tchau|hello|greet|acen/i
const IDLE_CLIP = /idle|stand|breath|respir/i

const BASE_Y = -1.1 // altura dos pés do personagem na cena
const SKIN = '#f1c9a5'
const HAIR = '#2b1d14'

// ---------- personagem feito em código (usado enquanto não há .glb) ----------
function Character({ waving, onWave, shirt, setHover }) {
  const root = useRef()
  const head = useRef()
  const arm = useRef()
  const t0 = useRef(0)

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    // respira
    root.current.position.y = BASE_Y + Math.sin(t * 1.6) * 0.02
    // cabeça acompanha o mouse
    const { x, y } = state.pointer
    head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, x * 0.5, 0.08)
    head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -y * 0.25, 0.08)
    // braço: acena quando waving, senão descansa
    if (waving) t0.current += dt
    else t0.current = 0
    const target = waving ? 2.5 + Math.sin(t0.current * 12) * 0.4 : 0.12
    arm.current.rotation.z = THREE.MathUtils.lerp(arm.current.rotation.z, target, 0.18)
  })

  return (
    <group
      ref={root}
      onClick={onWave}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      position={[0, BASE_Y, 0]}
    >
      {/* tronco */}
      <mesh position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.55, 0.7, 8, 24]} />
        <meshStandardMaterial color={shirt} roughness={0.8} />
      </mesh>
      {/* pescoço */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.15, 0.17, 0.25, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} />
      </mesh>

      {/* cabeça */}
      <group ref={head} position={[0, 1.95, 0]}>
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
        {/* cabelo */}
        <mesh position={[0, 0.06, -0.04]} rotation={[-0.25, 0, 0]}>
          <sphereGeometry args={[0.585, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={HAIR} roughness={0.9} />
        </mesh>
        {/* olhos */}
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 0.05, 0.5]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#1c1c1a" />
          </mesh>
        ))}
        {/* sorriso */}
        <mesh position={[0, -0.16, 0.5]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.14, 0.022, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#1c1c1a" />
        </mesh>
      </group>

      {/* braço parado (esquerdo) */}
      <mesh position={[-0.72, 0.55, 0]} rotation={[0, 0, 0.12]}>
        <capsuleGeometry args={[0.16, 0.7, 8, 16]} />
        <meshStandardMaterial color={shirt} roughness={0.8} />
      </mesh>
      <mesh position={[-0.8, -0.05, 0]}>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.7} />
      </mesh>

      {/* braço que acena (direito), com o pivô no ombro */}
      <group ref={arm} position={[0.62, 1.0, 0]}>
        <mesh position={[0.1, -0.4, 0]} rotation={[0, 0, -0.12]}>
          <capsuleGeometry args={[0.16, 0.7, 8, 16]} />
          <meshStandardMaterial color={shirt} roughness={0.8} />
        </mesh>
        <mesh position={[0.18, -1.0, 0]}>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
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
    const scale = 3.4 / (size.y || 1)
    return { scale, y: -box.min.y * scale - 1.7 }
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
    // usa a animação de tchau se existir; senão a primeira que houver
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
    const t = state.clock.elapsedTime
    group.current.rotation.z = waving ? Math.sin(t * 14) * 0.06 : 0
    group.current.rotation.y = MODEL_ROTATION_Y
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

export default function AvatarScene({ waving, onWave, shirt }) {
  const [hover, setHover] = useState(false)
  const hasModel = useHasModel()

  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.2], fov: 35 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ cursor: hover ? 'pointer' : 'default' }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight position={[-4, 1, 2]} intensity={0.6} />
      <Suspense fallback={null}>
        {hasModel ? (
          <UserModel waving={waving} onWave={onWave} setHover={setHover} />
        ) : (
          <Character waving={waving} onWave={onWave} shirt={shirt} setHover={setHover} />
        )}
      </Suspense>
    </Canvas>
  )
}
