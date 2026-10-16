import { useEffect, useState } from 'react'
import { profile } from '../data'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

function Card({ title, children }) {
  return (
    <div className="box p-3">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-wider opacity-60">{title}</div>
      {children}
    </div>
  )
}

export default function Widgets() {
  const now = useClock()
  const time = now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })

  return (
    <div className="flex w-[230px] flex-col gap-3">
      <Card title="Local">
        <div className="font-mono text-2xl font-bold">{time}</div>
        <div className="text-xs opacity-70">{profile.city}</div>
      </Card>
      <Card title="Estudando agora">
        {[['Java', 'foco'], ['SQL', 'em andamento'], ['React', 'praticando']].map(([n, s]) => (
          <div key={n} className="flex items-center justify-between border-b border-ink/15 py-1 text-xs last:border-0">
            <span className="font-semibold">{n}</span>
            <span className="rounded bg-accent/20 px-1.5 py-0.5 font-mono text-[10px]">{s}</span>
          </div>
        ))}
      </Card>
      <Card title="Nota">
        <p className="text-xs">Hoje estou aprendendo Java e construindo meu portfólio. Um commit por dia.</p>
      </Card>
    </div>
  )
}
