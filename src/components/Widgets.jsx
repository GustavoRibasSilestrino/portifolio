import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { career, contact, location, music, statusCard, ui, weatherQuips, widgetText } from '../data'
import { useApp } from '../context'
import Icon from './Icon'

// ---------- dados reais ----------

const cached = (key, maxAgeMs) => {
  try {
    const c = JSON.parse(sessionStorage.getItem(key))
    if (c && Date.now() - c.at < maxAgeMs) return c.data
  } catch {
    /* sem cache */
  }
  return null
}
const store = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* sem cache */
  }
}

// Clima atual via Open-Meteo (gratuito, sem chave). Atualiza a cada 10 minutos.
function useWeather() {
  const [state, setState] = useState(() => cached('weather', 10 * 60e3) ?? { status: 'loading' })
  useEffect(() => {
    let alive = true
    const load = () => {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}` +
        '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day' +
        '&timezone=America%2FSao_Paulo'
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(r.status)
          return r.json()
        })
        .then((j) => {
          const c = j.current
          const data = {
            status: 'ok',
            temp: c.temperature_2m,
            feels: c.apparent_temperature,
            humidity: c.relative_humidity_2m,
            code: c.weather_code,
            day: c.is_day === 1,
          }
          store('weather', data)
          if (alive) setState(data)
        })
        .catch(() => alive && setState((s) => (s.status === 'ok' ? s : { status: 'error' })))
    }
    if (state.status !== 'ok') load()
    const id = setInterval(load, 10 * 60e3)
    return () => {
      alive = false
      clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return state
}

// Último push público do GitHub (API pública, até 60 consultas/h por IP; guardamos 5 min em cache).
function useGithub() {
  const user = contact.github.replace(/\/+$/, '').split('/').pop()
  const [state, setState] = useState(() => cached('github', 5 * 60e3) ?? { status: 'loading' })
  useEffect(() => {
    if (state.status === 'ok' || state.status === 'empty') return
    let alive = true
    fetch(`https://api.github.com/users/${user}/events/public?per_page=30`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status)
        return r.json()
      })
      .then((events) => {
        const push = events.find((e) => e.type === 'PushEvent')
        const data = push
          ? {
              status: 'ok',
              repo: push.repo.name,
              commits: push.payload.size ?? push.payload.commits?.length ?? 1,
              at: push.created_at,
            }
          : { status: 'empty' }
        store('github', data)
        if (alive) setState(data)
      })
      .catch(() => alive && setState({ status: 'error' }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return { ...state, user }
}

// ---------- corpos dos cards ----------

function diffYMD(from, to) {
  let y = to.getFullYear() - from.getFullYear()
  let m = to.getMonth() - from.getMonth()
  let d = to.getDate() - from.getDate()
  if (d < 0) {
    m -= 1
    d += new Date(to.getFullYear(), to.getMonth(), 0).getDate()
  }
  if (m < 0) {
    y -= 1
    m += 12
  }
  return { y: Math.max(y, 0), m, d }
}

function CareerBody() {
  const { t, lang } = useApp()
  const from = new Date(`${career.since}T00:00:00`)
  const { y, m, d } = diffYMD(from, new Date())
  const since = from.toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', { month: 'long', year: 'numeric' })
  return (
    <>
      <div className="flex items-end gap-4">
        {[
          [y, widgetText.years],
          [m, widgetText.months],
          [d, widgetText.days],
        ].map(([n, label], i) => (
          <div key={i}>
            <div className="text-3xl font-semibold leading-none">{n}</div>
            <div className="mt-1 text-[10px] opacity-60">{t(label)}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs opacity-80">
        {t(career.sinceText)} {since}
      </p>
    </>
  )
}

const weatherIcon = (code, day) => {
  if (code === 0) return day ? 'sun' : 'moon'
  if (code <= 3) return 'cloud'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 95) return 'storm'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 85 && code <= 86) return 'snow'
  return 'rain'
}

function WeatherBody() {
  const { t } = useApp()
  const w = useWeather()
  if (w.status === 'loading') return <p className="text-xs opacity-70">{t(widgetText.loading)}</p>
  if (w.status === 'error') return <p className="text-xs opacity-70">{t(widgetText.weatherError)}</p>

  const quip = weatherQuips.find((q) => w.temp < q.max)
  const pos = Math.min(Math.max((w.temp - 5) / 35, 0), 1) * 100
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <Icon name={weatherIcon(w.code, w.day)} size={30} />
        <div>
          <div className="text-2xl font-semibold leading-none">{Math.round(w.temp)}°C</div>
          <div className="mt-1 text-[10px] opacity-70">
            {t(widgetText.feels)} {Math.round(w.feels)}°C · {w.humidity}%
          </div>
        </div>
      </div>
      <div>
        <div className="relative h-2 rounded-full bg-gradient-to-r from-mid to-accent">
          <span
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-card"
            style={{ left: `${pos}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] opacity-60">
          <span>{t(widgetText.hoodie)}</span>
          <span>{t(widgetText.melting)}</span>
        </div>
      </div>
      <p className="text-xs font-medium">{t(quip)}</p>
    </div>
  )
}

function StatusBody() {
  const { t } = useApp()
  // nível de café segue a hora em São Paulo: manhã cheio, noite quase vazio
  const hour = Number(
    new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false }),
  )
  const level = hour >= 5 && hour < 12 ? 3 : hour >= 12 && hour < 18 ? 2 : hour >= 18 ? 1 : 0
  return (
    <>
      <p className="text-sm font-medium leading-snug">{t(statusCard.text)}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] opacity-70">
        <span>{t(statusCard.coffee)}</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full border border-ink ${i < level ? 'bg-ink' : ''}`}
            />
          ))}
        </span>
      </div>
    </>
  )
}

function GithubBody() {
  const { t, lang } = useApp()
  const g = useGithub()
  if (g.status === 'loading') return <p className="text-xs opacity-70">{t(widgetText.loading)}</p>
  if (g.status === 'error') return <p className="text-xs opacity-70">{t(widgetText.githubError)}</p>
  if (g.status === 'empty') return <p className="text-xs opacity-70">{t(widgetText.githubEmpty)}</p>

  const days = Math.floor((Date.now() - new Date(g.at).getTime()) / 864e5)
  const when =
    days <= 0
      ? lang === 'en' ? 'today' : 'hoje'
      : days === 1
        ? lang === 'en' ? 'yesterday' : 'ontem'
        : lang === 'en' ? `${days} days ago` : `há ${days} dias`
  const line = t(widgetText.pushed)
    .replace('{n}', g.commits)
    .replace('{commits}', t(g.commits === 1 ? widgetText.commit : widgetText.commits))
  return (
    <>
      <p className="text-sm font-medium leading-snug">{line}</p>
      <a
        href={`https://github.com/${g.repo}`}
        target="_blank"
        rel="noreferrer"
        className="mt-1 block truncate text-xs text-accent underline-offset-2 hover:underline"
      >
        {g.repo}
      </a>
      <div className="mt-1 text-[11px] opacity-60">{when}</div>
    </>
  )
}

const fmt = (s) => {
  if (!Number.isFinite(s)) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

// Player oficial do YouTube (sem baixar nada: o vídeo continua no YouTube e conta como visualização).
// Começa compacto (capa + título + botão). Ao clicar em tocar, o vídeo abre e começa a tocar.
function YouTubeBody() {
  const { t } = useApp()
  const { id, title, artist } = music.youtube
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="flex items-center gap-3">
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          draggable={false}
          className="h-12 w-12 shrink-0 rounded-md border border-ink/20 object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="truncate text-xs opacity-60">{artist}</div>
        </div>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setOpen((o) => !o)}
          aria-label={t(open ? ui.close : ui.play)}
          title={t(open ? ui.close : ui.play)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-card"
        >
          <Icon name={open ? 'x' : 'play'} size={18} />
        </button>
      </div>
      {open && (
        <div className="mt-3 aspect-video w-full overflow-hidden rounded-md border border-ink/20 bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={`${title} · ${artist}`}
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}

function MusicBody() {
  return music.youtube?.id ? <YouTubeBody /> : <PlaylistBody />
}

function PlaylistBody() {
  const list = music.playlist
  const audio = useRef(null)
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState({ cur: 0, dur: 0 })
  const [vol, setVol] = useState(0.7)
  const track = list[i]

  useEffect(() => {
    if (audio.current) audio.current.volume = vol
  }, [vol])

  useEffect(() => {
    if (playing) audio.current?.play().catch(() => setPlaying(false))
    else audio.current?.pause()
  }, [playing, i])

  const go = (n) => setI((i + n + list.length) % list.length)

  return (
    <div className="space-y-3">
      <audio
        ref={audio}
        src={track.src}
        onTimeUpdate={(e) => setPos({ cur: e.target.currentTime, dur: e.target.duration })}
        onLoadedMetadata={(e) => setPos({ cur: 0, dur: e.target.duration })}
        onEnded={() => go(1)}
      />
      <div className="flex items-center gap-3">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'pause' : 'play'}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-card"
        >
          <Icon name={playing ? 'pause' : 'play'} size={18} />
        </button>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{track.title}</div>
          <div className="truncate text-xs opacity-60">
            {track.artist} · {i + 1}/{list.length}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] opacity-80">
        <span>{fmt(pos.cur)}</span>
        <input
          type="range"
          min="0"
          max={pos.dur || 0}
          step="0.1"
          value={pos.cur}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            audio.current.currentTime = Number(e.target.value)
          }}
          className="h-1 flex-1 accent-[rgb(var(--c-accent))]"
          aria-label="progress"
        />
        <span>{fmt(pos.dur)}</span>
      </div>

      <div className="flex items-center gap-3">
        <button onPointerDown={(e) => e.stopPropagation()} onClick={() => go(-1)} aria-label="previous">
          <Icon name="skipBack" size={16} />
        </button>
        <button onPointerDown={(e) => e.stopPropagation()} onClick={() => go(1)} aria-label="next">
          <Icon name="skipForward" size={16} />
        </button>
        <Icon name="volume" size={16} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={vol}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => setVol(Number(e.target.value))}
          className="h-1 w-24 accent-[rgb(var(--c-accent))]"
          aria-label="volume"
        />
      </div>

      <ul className="max-h-40 divide-y divide-ink/15 overflow-y-auto text-xs">
        {list.map((tr, n) => (
          <li key={n}>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                setI(n)
                setPlaying(true)
              }}
              className={`flex w-full justify-between gap-2 px-2 py-1.5 text-left ${
                n === i ? 'bg-ink text-paper' : 'hover:bg-ink/10'
              }`}
            >
              <span className="truncate">{tr.title}</span>
              <span className="shrink-0 opacity-60">{tr.artist}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------- cards soltos pela tela ----------

export const cards = [
  { id: 'estrada', col: 'a', title: widgetText.career, enabled: !!career.since, Body: CareerBody },
  { id: 'clima', col: 'a', title: widgetText.weather, enabled: true, Body: WeatherBody },
  { id: 'musica', col: 'a', title: widgetText.music, enabled: !!music.youtube?.id || music.playlist.length > 0, width: 264, Body: MusicBody },
  { id: 'status', col: 'b', title: widgetText.status, enabled: true, Body: StatusBody },
  { id: 'github', col: 'b', title: widgetText.github, enabled: true, Body: GithubBody },
].filter((c) => c.enabled)

// Arraste cada card para qualquer lugar ou jogue na lixeira (clique nela para restaurar).
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

  const renderCard = (c) => (
    <motion.div
      key={c.id}
      layout
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
      style={{ width: c.width ?? 230 }}
      className="box pointer-events-auto relative z-[5] cursor-grab overflow-hidden active:cursor-grabbing"
    >
      <div className="flex items-center gap-1.5 border-b border-ink/10 px-2 py-1.5 text-[11px] font-medium opacity-80">
        <Icon name="grip" size={12} />
        <span className="flex-1 truncate">{t(c.title)}</span>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => remove(c.id)}
          aria-label={`${t(ui.remove)} ${t(c.title)}`}
          className="leading-none opacity-60 hover:opacity-100"
        >
          ×
        </button>
      </div>
      <div className="p-2.5">
        <c.Body />
      </div>
    </motion.div>
  )

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* todos os cards começam juntos, na lateral esquerda, ao lado dos ícones */}
      <div className="absolute left-[100px] top-3 flex flex-col items-start gap-3">
        <AnimatePresence>{cards.filter((c) => !removed.includes(c.id)).map(renderCard)}</AnimatePresence>
      </div>

      <button
        ref={trash}
        onClick={() => setRemoved([])}
        title={removed.length ? t(ui.trashRestore) : t(ui.trash)}
        className={`box pointer-events-auto absolute bottom-14 right-5 z-[6] flex flex-col items-center gap-0.5 p-2 transition [--depth:4px] ${
          overTrash ? 'scale-110 !bg-ink text-paper' : ''
        }`}
      >
        <Icon name="trash" size={22} />
        <span className="text-[10px]">
          {t(ui.trash)}
          {removed.length ? ` (${removed.length})` : ''}
        </span>
      </button>
    </div>
  )
}
