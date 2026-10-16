import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile, ui, widgets } from '../data'
import { useApp } from '../context'
import Icon from './Icon'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
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
  const { t } = useApp()
  return widgets.studyItems.map(([name, status]) => (
    <div key={name} className="flex items-center justify-between border-b border-ink/15 py-1 text-xs last:border-0">
      <span className="font-semibold">{name}</span>
      <span className="rounded border border-ink px-1.5 py-0.5 font-mono text-[10px]">{t(status)}</span>
    </div>
  ))
}

function NoteBody() {
  const { t } = useApp()
  return <p className="text-xs">{t(widgets.noteText)}</p>
}

const cards = [
  { id: 'local', title: widgets.local, top: 200, Body: LocalBody },
  { id: 'estudo', title: widgets.study, top: 305, Body: StudyBody },
  { id: 'nota', title: widgets.note, top: 470, Body: NoteBody },
]

// Cards soltos pela tela: arraste para qualquer lugar ou jogue na lixeira.
export default function Widgets() {
  const { t } = useApp()
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
              className="box pointer-events-auto absolute z-[5] cursor-grab overflow-hidden active:cursor-grabbing"
            >
              <div className="flex items-center justify-between border-b-2 border-ink px-2.5 py-1">
                <span className="font-mono text-[10px] uppercase tracking-wider">
                  {String(cards.indexOf(c) + 1).padStart(2, '0')}. {t(c.title)}
                </span>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => remove(c.id)}
                  aria-label={`${t(ui.remove)} ${t(c.title)}`}
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
        title={removed.length ? t(ui.trashRestore) : t(ui.trash)}
        className={`pointer-events-auto absolute bottom-14 right-4 z-[5] flex flex-col items-center gap-0.5 rounded-lg border-2 border-ink p-2 transition ${
          overTrash ? 'scale-110 bg-ink text-paper' : 'bg-card'
        }`}
      >
        <Icon name="trash" size={22} />
        <span className="font-mono text-[10px]">
          {t(ui.trash)}
          {removed.length ? ` (${removed.length})` : ''}
        </span>
      </button>
    </div>
  )
}
