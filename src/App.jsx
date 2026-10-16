import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Window from './components/Window'
import Taskbar from './components/Taskbar'
import Avatar from './components/Avatar'
import Widgets from './components/Widgets'
import Icon from './components/Icon'
import CursorTrail from './components/CursorTrail'
import MobileShell from './components/MobileShell'
import {
  AboutPanel,
  ExperiencePanel,
  ProjectsPanel,
  WorkPanel,
  ContactPanel,
  TerminalPanel,
  VolunteerPanel,
  NowPanel,
} from './components/Panels'
import { profile } from './data'
import { useApp } from './context'

// Categorias da lateral, na ordem em que aparecem.
const apps = [
  { id: 'sobre', icon: 'user', title: { pt: 'Sobre mim', en: 'About me' }, Body: AboutPanel, width: 560 },
  { id: 'exp', icon: 'briefcase', title: { pt: 'Experiência', en: 'Experience' }, Body: ExperiencePanel },
  { id: 'projetos', icon: 'folder', title: { pt: 'Projetos', en: 'Projects' }, Body: ProjectsPanel },
  { id: 'como', icon: 'compass', title: { pt: 'Como eu trabalho', en: 'How I work' }, Body: WorkPanel },
  { id: 'contato', icon: 'mail', title: { pt: 'Contato', en: 'Contact' }, Body: ContactPanel, width: 440 },
  { id: 'terminal', icon: 'terminal', title: { pt: 'Terminal', en: 'Terminal' }, Body: TerminalPanel, width: 480 },
  { id: 'voluntariado', icon: 'heart', title: { pt: 'Voluntariado', en: 'Volunteering' }, Body: VolunteerPanel, width: 440 },
  { id: 'agora', icon: 'sparkles', title: { pt: 'Agora', en: 'Now' }, Body: NowPanel, width: 480 },
]

// celular: abaixo de 768px usamos a versão com barra inferior e apps em tela cheia
function useIsMobile() {
  const query = '(max-width: 767px)'
  const [mobile, setMobile] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMobile(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return mobile
}

// tamanho da janela do navegador (para o avatar crescer em telas grandes)
function useViewport() {
  const [v, setV] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const on = () => setV({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return v
}

// O avatar ocupa o espaço vazio do centro: cresce com a tela (até 560px) e fica entre a janela
// "Sobre mim" (termina perto de x = 940) e o canto direito, sem passar da lixeira.
function avatarLayout({ w, h }) {
  const size = Math.round(Math.min(Math.max(340, w * 0.28), 560, (h - 140) * 0.9))
  const freeStart = 940
  const freeEnd = w * 0.78
  const centered = (freeStart + freeEnd) / 2 - size / 2
  const left = Math.min(Math.max(centered, 880), w - size - 100)
  return { size, left: Math.round(left) }
}

export default function App() {
  const { t } = useApp()
  const isMobile = useIsMobile()
  const avatar = avatarLayout(useViewport())
  const [open, setOpen] = useState(['sobre'])
  const [order, setOrder] = useState(['sobre'])
  const [minimized, setMinimized] = useState([])
  const [layoutKey, setLayoutKey] = useState(0)

  const focus = (id) => setOrder((o) => [...o.filter((x) => x !== id), id])
  const restore = (id) => setMinimized((m) => m.filter((x) => x !== id))

  const openApp = (id) => {
    setOpen((o) => (o.includes(id) ? o : [...o, id]))
    restore(id)
    focus(id)
  }
  const close = (id) => {
    setOpen((o) => o.filter((x) => x !== id))
    setOrder((o) => o.filter((x) => x !== id))
    restore(id)
  }
  const minimize = (id) => setMinimized((m) => (m.includes(id) ? m : [...m, id]))

  // volta tudo ao início: só "Sobre mim" aberta, janelas e cards nas posições originais, lixeira vazia
  const resetLayout = () => {
    setOpen(['sobre'])
    setOrder(['sobre'])
    setMinimized([])
    setLayoutKey((k) => k + 1)
  }

  // clique na barra de tarefas: restaura, traz pra frente ou minimiza se já está na frente
  const onTask = (id) => {
    if (minimized.includes(id)) return openApp(id)
    const visible = order.filter((x) => !minimized.includes(x))
    if (visible[visible.length - 1] === id) return minimize(id)
    focus(id)
  }

  if (isMobile) return <MobileShell apps={apps} />

  return (
    <div className="relative h-full w-full overflow-hidden">
      <CursorTrail />
      <div className="absolute left-3 top-3 z-10 flex max-h-[calc(100%-64px)] flex-col gap-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {apps.map((a) => (
          <button key={a.id} onClick={() => openApp(a.id)} className="group flex w-[72px] shrink-0 flex-col items-center gap-2">
            <span className="box grid h-11 w-11 place-items-center transition [--depth:3px] group-hover:!bg-ink group-hover:text-paper">
              <Icon name={a.icon} size={22} />
            </span>
            <span className="text-center text-[10px] leading-tight">{t(a.title)}</span>
          </button>
        ))}
      </div>

      <div className="pointer-events-none absolute right-4 top-3 hidden flex-col items-end gap-2 sm:flex">
        <h1 className="text-right font-display text-[clamp(2.25rem,6vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.025em] text-ink/85">
          Gustavo<br />Ribas
        </h1>
        <p className="text-right text-xs opacity-70">{t(profile.role)}</p>
      </div>

      <Widgets key={layoutKey} />
      <div className="absolute bottom-11 hidden md:block" style={{ left: avatar.left }}>
        <Avatar size={avatar.size} />
      </div>

      <AnimatePresence>
        {open.map((id, idx) => {
          const a = apps.find((x) => x.id === id)
          return (
            <Window
              key={`${layoutKey}-${id}`}
              title={t(a.title)}
              icon={a.icon}
              index={idx}
              width={a.width}
              zIndex={10 + order.indexOf(id)}
              minimized={minimized.includes(id)}
              onFocus={() => focus(id)}
              onClose={() => close(id)}
              onMinimize={() => minimize(id)}
            >
              <a.Body />
            </Window>
          )
        })}
      </AnimatePresence>

      <Taskbar apps={apps} open={open} minimized={minimized} onOpen={openApp} onTask={onTask} onReset={resetLayout} />
    </div>
  )
}
