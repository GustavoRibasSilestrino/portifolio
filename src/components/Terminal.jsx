import { useState, useRef, useEffect } from 'react'
import { profile, skills, projects, contact } from '../data'

const run = (cmd) => {
  switch (cmd) {
    case 'help':
      return 'Comandos: sobre, skills, projetos, contato, whoami, clear'
    case 'whoami':
      return `${profile.name} · ${profile.age} anos · ${profile.city}`
    case 'sobre':
      return `${profile.role}\n${profile.school}`
    case 'skills':
      return skills.map((s) => `${s.group}: ${s.items.join(', ')}`).join('\n')
    case 'projetos':
      return projects.map((p) => `- ${p.name}`).join('\n')
    case 'contato':
      return [`email: ${contact.email}`, `github: ${contact.github}`, contact.linkedin && `linkedin: ${contact.linkedin}`]
        .filter(Boolean)
        .join('\n')
    default:
      return `comando não encontrado: ${cmd} (digite "help")`
  }
}

export default function Terminal() {
  const [lines, setLines] = useState([{ t: 'out', v: 'Bem-vindo! Digite "help" para ver os comandos.' }])
  const [value, setValue] = useState('')
  const end = useRef(null)
  useEffect(() => end.current?.scrollIntoView(), [lines])

  const submit = (e) => {
    e.preventDefault()
    const cmd = value.trim().toLowerCase()
    setValue('')
    if (!cmd) return
    if (cmd === 'clear') return setLines([])
    setLines((l) => [...l, { t: 'in', v: cmd }, { t: 'out', v: run(cmd) }])
  }

  return (
    <div className="-m-4 min-h-[220px] bg-ink p-3 font-mono text-xs text-green-300">
      {lines.map((l, i) => (
        <pre key={i} className={`whitespace-pre-wrap ${l.t === 'in' ? 'text-paper' : ''}`}>
          {l.t === 'in' ? '$ ' : ''}{l.v}
        </pre>
      ))}
      <form onSubmit={submit} className="flex gap-2">
        <span className="text-paper">$</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent text-paper outline-none"
          spellCheck="false"
        />
      </form>
      <div ref={end} />
    </div>
  )
}
