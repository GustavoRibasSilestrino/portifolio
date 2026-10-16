import { useRef, useState } from 'react'
import { motion, useDragControls, useMotionValue } from 'framer-motion'
import Icon from './Icon'
import { useApp } from '../context'
import { ui } from '../data'

function Ctrl({ icon, label, onClick, hover = 'hover:bg-paper/20' }) {
  return (
    <button
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-6 w-6 place-items-center rounded ${hover}`}
    >
      <Icon name={icon} size={14} />
    </button>
  )
}

export default function Window({ title, icon, index, zIndex, minimized, onFocus, onClose, onMinimize, children, width = 520 }) {
  const { t } = useApp()
  const controls = useDragControls()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const saved = useRef({ x: 0, y: 0 })
  const [max, setMax] = useState(false)

  const toggleMax = () => {
    if (!max) {
      saved.current = { x: x.get(), y: y.get() }
      x.set(0)
      y.set(0)
    } else {
      x.set(saved.current.x)
      y.set(saved.current.y)
    }
    setMax(!max)
  }

  const layout = max
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 44px)' }
    : { left: 90 + index * 28, top: 20 + index * 28, width, maxWidth: 'calc(100vw - 100px)', maxHeight: '78vh' }

  return (
    <motion.div
      drag={!max}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: minimized ? 0 : 1, scale: minimized ? 0.9 : 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.15 }}
      onPointerDown={onFocus}
      style={{ x, y, zIndex, visibility: minimized ? 'hidden' : 'visible', ...layout }}
      className={`box absolute flex flex-col overflow-hidden ${max ? '!rounded-none' : ''}`}
    >
      <div
        onPointerDown={(e) => !max && controls.start(e)}
        onDoubleClick={toggleMax}
        className={`flex touch-none select-none items-center gap-2 bg-ink px-3 py-2 text-paper ${
          max ? '' : 'cursor-grab active:cursor-grabbing'
        }`}
      >
        <Icon name={icon} size={16} />
        <span className="flex-1 truncate text-sm font-bold">{title}</span>
        <Ctrl icon="minus" label={t(ui.minimize)} onClick={onMinimize} />
        <Ctrl icon={max ? 'restore' : 'maximize'} label={t(max ? ui.restore : ui.maximize)} onClick={toggleMax} />
        <Ctrl icon="x" label={t(ui.close)} onClick={onClose} hover="hover:bg-red-500" />
      </div>
      <div className="scroll flex-1 overflow-y-auto p-5 text-sm leading-relaxed">{children}</div>
    </motion.div>
  )
}
