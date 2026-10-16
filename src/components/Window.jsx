import { motion, useDragControls } from 'framer-motion'

export default function Window({ title, icon, index, zIndex, onFocus, onClose, children, width = 440 }) {
  const controls = useDragControls()
  return (
    <motion.div
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.15 }}
      onPointerDown={onFocus}
      style={{ zIndex, left: 90 + index * 28, top: 70 + index * 28, maxWidth: 'calc(100vw - 100px)', width }}
      className="box absolute flex max-h-[70vh] flex-col overflow-hidden"
    >
      <div
        onPointerDown={(e) => controls.start(e)}
        className="flex cursor-grab touch-none select-none items-center gap-2 border-b-2 border-ink bg-ink px-3 py-1.5 text-paper active:cursor-grabbing"
      >
        <span>{icon}</span>
        <span className="flex-1 truncate font-mono text-xs">{title}</span>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          aria-label="Fechar janela"
          className="grid h-5 w-5 place-items-center rounded bg-paper text-xs font-bold text-ink hover:bg-red-400"
        >
          ×
        </button>
      </div>
      <div className="scroll overflow-y-auto p-4 text-sm leading-relaxed">{children}</div>
    </motion.div>
  )
}
