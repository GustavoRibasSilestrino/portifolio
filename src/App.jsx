import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Window from './components/Window'
import Taskbar from './components/Taskbar'
import Avatar from './components/Avatar'
import Widgets from './components/Widgets'
import Terminal from './components/Terminal'
import { profile, skills, projects, timeline, contact } from './data'

const Tag = ({ children }) => (
  <span className="rounded border border-ink px-1.5 py-0.5 font-mono text-[10px]">{children}</span>
)

const apps = [
  {
    id: 'sobre', title: 'Sobre mim', icon: '👤',
    body: () => (
      <div className="space-y-3">
        {profile.about.map((p, i) => <p key={i}>{p}</p>)}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Tag>{profile.age} anos</Tag><Tag>{profile.city}</Tag><Tag>{profile.school}</Tag>
        </div>
      </div>
    ),
  },
  {
    id: 'skills', title: 'Habilidades', icon: '🛠️',
    body: () => (
      <div className="space-y-4">
        {skills.map((g) => (
          <div key={g.group}>
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider opacity-60">{g.group}</div>
            <div className="flex flex-wrap gap-1.5">{g.items.map((i) => <Tag key={i}>{i}</Tag>)}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'projetos', title: 'Projetos', icon: '📁',
    body: () => (
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.name} className="rounded border-2 border-ink p-3">
            <div className="font-bold">{p.name}</div>
            <p className="my-1 text-xs opacity-80">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5">{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'formacao', title: 'Formação', icon: '🎓',
    body: () => (
      <div className="space-y-4 border-l-2 border-ink pl-4">
        {timeline.map((t) => (
          <div key={t.title}>
            <div className="font-mono text-[10px] opacity-60">{t.when}</div>
            <div className="font-bold">{t.title}</div>
            <div className="text-xs opacity-70">{t.where}</div>
            <p className="mt-1 text-xs">{t.text}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'contato', title: 'Contato', icon: '✉️',
    body: () => (
      <div className="space-y-2">
        <p>Quer conversar, trocar ideia ou me chamar para um projeto? Fala comigo:</p>
        <a className="block underline" href={`mailto:${contact.email}`}>{contact.email}</a>
        <a className="block underline" href={contact.github} target="_blank" rel="noreferrer">GitHub</a>
        <a className="block underline" href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    ),
  },
  { id: 'terminal', title: 'Terminal', icon: '⌨️', width: 460, body: () => <Terminal /> },
]

export default function App() {
  const [open, setOpen] = useState(['sobre'])
  const [order, setOrder] = useState(['sobre'])

  const focus = (id) => setOrder((o) => [...o.filter((x) => x !== id), id])
  const openApp = (id) => {
    setOpen((o) => (o.includes(id) ? o : [...o, id]))
    focus(id)
  }
  const close = (id) => {
    setOpen((o) => o.filter((x) => x !== id))
    setOrder((o) => o.filter((x) => x !== id))
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-3">
        {apps.map((a) => (
          <button key={a.id} onClick={() => openApp(a.id)} className="group flex w-16 flex-col items-center gap-1">
            <span className="box grid h-11 w-11 place-items-center text-xl group-hover:bg-accent/30">{a.icon}</span>
            <span className="font-mono text-[10px]">{a.title}</span>
          </button>
        ))}
      </div>

      <h1 className="pointer-events-none absolute right-4 top-3 hidden text-right text-4xl font-bold leading-[0.95] sm:block md:text-6xl">
        Gustavo<br />Ribas
      </h1>
      <p className="pointer-events-none absolute right-4 top-28 hidden text-right font-mono text-xs opacity-70 md:block">
        {profile.role}
      </p>

      <div className="absolute right-4 top-40 hidden lg:block"><Widgets /></div>
      <div className="absolute bottom-14 left-1/2 hidden -translate-x-1/2 md:block"><Avatar /></div>

      <AnimatePresence>
        {open.map((id, idx) => {
          const a = apps.find((x) => x.id === id)
          return (
            <Window
              key={id}
              title={a.title}
              icon={a.icon}
              index={idx}
              width={a.width}
              zIndex={10 + order.indexOf(id)}
              onFocus={() => focus(id)}
              onClose={() => close(id)}
            >
              {a.body()}
            </Window>
          )
        })}
      </AnimatePresence>

      <Taskbar apps={apps} open={open} onOpen={openApp} onFocus={focus} />
    </div>
  )
}
