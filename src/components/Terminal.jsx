import { useState, useRef, useEffect } from 'react'
import { profile, skills, projects, featured, contact, now, ui } from '../data'
import { useApp } from '../context'

const aliases = { about: 'sobre', projects: 'projetos', contact: 'contato', now: 'agora' }

export default function Terminal() {
  const { t } = useApp()
  const [lines, setLines] = useState([{ k: 'out', v: ui.termWelcome }])
  const [value, setValue] = useState('')
  const end = useRef(null)
  useEffect(() => {
    end.current?.scrollIntoView()
  }, [lines])

  // Saídas guardam o texto (ou o objeto {pt,en}) e são traduzidas ao renderizar,
  // assim trocar o idioma atualiza o que já está na tela.
  const run = (raw) => {
    const cmd = aliases[raw] ?? raw
    switch (cmd) {
      case 'help':
        return ui.termHelp
      case 'whoami':
        return `${profile.name} · ${profile.age} · ${profile.city}`
      case 'sobre':
        return { fn: () => `${t(profile.role)}\n${profile.school}` }
      case 'skills':
        return { fn: () => skills.map((s) => `${t(s.group)}: ${s.items.map(t).join(', ')}`).join('\n') }
      case 'projetos':
        return {
          fn: () =>
            [`- ${featured.name} (${t(featured.awardShort)})`, ...projects.map((p) => `- ${t(p.name)}`)].join('\n'),
        }
      case 'agora':
        return { fn: () => now.items.map((i) => `${t(i.label)}: ${t(i.text)}`).join('\n') }
      case 'contato':
        return `email: ${contact.email}\ngithub: ${contact.github}\nlinkedin: ${contact.linkedin}`
      default:
        return { fn: () => t(ui.termNotFound).replace('{cmd}', raw) }
    }
  }

  const render = (v) => (v && typeof v === 'object' && v.fn ? v.fn() : t(v))

  const submit = (e) => {
    e.preventDefault()
    const cmd = value.trim().toLowerCase()
    setValue('')
    if (!cmd) return
    if (cmd === 'clear') return setLines([])
    setLines((l) => [...l, { k: 'in', v: cmd }, { k: 'out', v: run(cmd) }])
  }

  return (
    <div
      className="-m-5 bg-bar p-4 font-term text-xs text-green-300"
      style={{ minHeight: 'max(240px, calc(100% + 2.5rem))' }}
    >
      {lines.map((l, i) => (
        <pre key={i} className={`whitespace-pre-wrap ${l.k === 'in' ? 'text-onbar' : ''}`}>
          {l.k === 'in' ? '$ ' : ''}
          {l.k === 'in' ? l.v : render(l.v)}
        </pre>
      ))}
      <form onSubmit={submit} className="flex gap-2">
        <span className="text-onbar">$</span>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent text-onbar outline-none"
          spellCheck="false"
          aria-label="terminal"
        />
      </form>
      <div ref={end} />
    </div>
  )
}
