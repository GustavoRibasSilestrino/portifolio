import { useEffect, useState } from 'react'

export default function Taskbar({ apps, open, onOpen, onFocus }) {
  const [menu, setMenu] = useState(false)
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="absolute inset-x-0 bottom-0 z-[9999] flex h-11 items-center gap-2 border-t-2 border-ink bg-ink px-2 text-paper">
      <div className="relative">
        {menu && (
          <div className="box absolute bottom-10 left-0 w-48 p-1 text-ink">
            {apps.map((a) => (
              <button
                key={a.id}
                onClick={() => { onOpen(a.id); setMenu(false) }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-ink hover:text-paper"
              >
                <span>{a.icon}</span>{a.title}
              </button>
            ))}
          </div>
        )}
        <button onClick={() => setMenu((m) => !m)} className="rounded bg-accent px-3 py-1 text-sm font-bold text-white">
          Iniciar
        </button>
      </div>
      <div className="flex flex-1 gap-1 overflow-x-auto">
        {open.map((id) => {
          const a = apps.find((x) => x.id === id)
          return (
            <button key={id} onClick={() => onFocus(id)} className="flex shrink-0 items-center gap-1 rounded border border-paper/40 px-2 py-0.5 text-xs">
              {a.icon} <span className="hidden sm:inline">{a.title}</span>
            </button>
          )
        })}
      </div>
      <span className="font-mono text-xs">{now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  )
}
