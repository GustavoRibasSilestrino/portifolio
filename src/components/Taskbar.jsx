import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { useApp } from '../context'
import { palettes } from '../palettes'
import { ui } from '../data'

export default function Taskbar({ apps, open, minimized, onOpen, onTask }) {
  const { lang, setLang, mode, setMode, palette, setPalette, t } = useApp()
  const [menu, setMenu] = useState(false)
  const [pal, setPal] = useState(false)
  const [now, setNow] = useState(new Date())
  const startRef = useRef(null)
  const palRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  // fecha os menus ao clicar fora
  useEffect(() => {
    const onDown = (e) => {
      if (!startRef.current?.contains(e.target)) setMenu(false)
      if (!palRef.current?.contains(e.target)) setPal(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  return (
    <div className="absolute inset-x-0 bottom-0 z-[9999] flex h-11 items-center gap-2 border-t-2 border-ink bg-bar px-2 text-onbar">
      <div ref={startRef} className="relative">
        {menu && (
          <div className="box absolute bottom-10 left-0 w-52 p-1 text-ink">
            {apps.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  onOpen(a.id)
                  setMenu(false)
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-ink hover:text-paper"
              >
                <Icon name={a.icon} size={16} />
                {t(a.title)}
              </button>
            ))}
          </div>
        )}
        <button onClick={() => setMenu((m) => !m)} className="rounded bg-accent px-3 py-1 text-sm font-bold text-card">
          {t(ui.start)}
        </button>
      </div>

      <div className="flex flex-1 gap-1 overflow-x-auto">
        {open.map((id) => {
          const a = apps.find((x) => x.id === id)
          return (
            <button
              key={id}
              onClick={() => onTask(id)}
              className={`flex shrink-0 items-center gap-1 rounded border border-onbar/40 px-2 py-0.5 text-xs ${
                minimized.includes(id) ? 'opacity-50' : ''
              }`}
            >
              <Icon name={a.icon} size={14} /> <span className="hidden sm:inline">{t(a.title)}</span>
            </button>
          )
        })}
      </div>

      {/* idioma */}
      <div role="group" aria-label={t(ui.language)} className="flex overflow-hidden rounded border border-onbar/40 text-xs font-bold">
        {['en', 'pt'].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`px-2 py-1 uppercase ${lang === l ? 'bg-onbar text-bar' : 'hover:bg-onbar/10'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* tema claro / escuro */}
      <button
        onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        aria-label={t(mode === 'dark' ? ui.lightMode : ui.darkMode)}
        title={t(mode === 'dark' ? ui.lightMode : ui.darkMode)}
        className="grid h-7 w-7 place-items-center rounded border border-onbar/40 hover:bg-onbar/10"
      >
        <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={16} />
      </button>

      {/* paletas */}
      <div ref={palRef} className="relative">
        {pal && (
          <div className="box absolute bottom-10 right-0 w-64 p-1 text-ink">
            {palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPalette(p.id)
                  setPal(false)
                }}
                className="flex w-full items-center gap-3 rounded px-2 py-1.5 text-left hover:bg-ink/10"
              >
                <span className="flex overflow-hidden rounded border border-ink/30">
                  {[p.ink, p.mid, p.bg, p.accent].map((c) => (
                    <span key={c} style={{ background: c }} className="h-5 w-5" />
                  ))}
                </span>
                <span className="flex-1 text-sm leading-tight">{t(p.name)}</span>
                {p.id === palette && <Icon name="check" size={14} />}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setPal((v) => !v)}
          aria-label={t(ui.palette)}
          title={t(ui.palette)}
          className="grid h-7 w-7 place-items-center rounded border border-onbar/40 hover:bg-onbar/10"
        >
          <Icon name="palette" size={16} />
        </button>
      </div>

      <span className="font-mono text-xs">{now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  )
}
