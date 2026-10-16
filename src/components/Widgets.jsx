import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../data'
import Icon from './Icon'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

function LocalBody() {
  const now = useClock()
  const time = now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  return (
    <>
      <div className="font-mono text-2xl font-bold">{time}</div>
      <div className="text-xs opacity-70">{profile.city}</div>
    </>
  )
}

function StudyBody() {
  return [['Java', 'foco'], ['SQL', 'em andamento'], ['React', 'praticando']].map(([n, s]) => (
    <div key={n} className="flex items-center justify-between border-b border-ink/15 py-1 text-xs last:border-0">
      <span className="font-semibold">{n}</span>
      <span className="rounded border border-ink px-1.5 py-0.5 font-mono text-[10px]">{s}</span>
    </div>
  ))
}

function NoteBody() {
  return <p className="text-xs">Hoje estou aprendendo Java e construindo meu portfólio. Um commit por dia.</p>
}

const cards = [
  { id: 'local', title: 'Local', top: 200, Body: LocalBody },
  { id: 'estudo', title: 'Estudando agora', top: 305, Body: StudyBody },
  { id: 'nota', title: 'Nota', top: 470, Body: NoteBody },
]

// Cards soltos pela tela: arraste para qualquer lugar ou jogue na lixeira.
export default function Widgets() {
  const [removed, setRemoved] = useState([])
  const [overTrash, setOverTrash] = useState(false)
  const trash = useRef(null)

  const isOverTrash = (point) => {
    const r = trash.current?.getBoundingClientRect()
    if (!r) return false
    const pad = 16
    return point.x > r.left - pad && point.x < r.right + pad && point.y > r.top - pad && point.y < r.bottom + pad
  }

  const remove = (id) => setRemoved((r) => (r.includes(id) ? r : [...r, id]))

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      <AnimatePresence>
        {cards
          .filter((c) => !removed.includes(c.id))
          .map((c) => (
            <motion.div
              key={c.id}
              drag
              dragMomentum={false}
              whileDrag={{ zIndex: 60, scale: 1.02 }}
              onDrag={(_, info) => setOverTrash(isOverTrash(info.point))}
              onDragEnd={(_, info) => {
                setOverTrash(false)
                if (isOverTrash(info.point)) remove(c.id)
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              style={{ top: c.top, right: 16, width: 230 }}
              className="box pointer-events-auto absolute z-20 cursor-grab overflow-hidden active:cursor-grabbing"
            >
              <div className="flex items-center justify-between border-b-2 border-ink px-2.5 py-1">
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  {String(cards.indexOf(c) + 1).padStart(2, '0')}. {c.title}
                </span>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => remove(c.id)}
                  aria-label={`Remover ${c.title}`}
                  className="text-xs leading-none opacity-60 hover:opacity-100"
                >
                  ×
                </button>
              </div>
              <div className="p-3">
                <c.Body />
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      <button
        ref={trash}
        onClick={() => setRemoved([])}
        title={removed.length ? 'Clique para restaurar os cards' : 'Lixeira'}
        className={`pointer-events-auto absolute bottom-14 right-4 z-20 flex flex-col items-center gap-0.5 rounded-lg border-2 border-ink p-2 transition ${
          overTrash ? 'scale-110 bg-ink text-paper' : 'bg-paper'
        }`}
      >
        <Icon name="trash" size={22} />
        <span className="font-mono text-[10px]">
          Lixeira{removed.length ? ` (${removed.length})` : ''}
        </span>
      </button>
    </div>
  )
}
