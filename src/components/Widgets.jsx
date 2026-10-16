import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { career, contact, location, music, ui, weatherQuips, widgetText } from '../data'
import { useApp } from '../context'
import { moodFor, NEEDS, needColor, needValue, useHour } from '../mood'
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

// Dia no fuso de São Paulo (AAAA-MM-DD), para comparar "hoje / ontem" pelo calendário e não por janelas de 24h.
const dayKey = (iso) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
const daysBetween = (isoA, isoB) => Math.round((Date.parse(dayKey(isoA)) - Date.parse(dayKey(isoB))) / 864e5)

// Atividade real do GitHub: pega o repositório público com push mais recente e conta os commits do último dia.
// (A API de "eventos" ficava dias atrasada e não informa mais a quantidade de commits.)
// API pública sem chave: até 60 consultas/h por IP, por isso guardamos 5 min em cache.
function useGithub() {
  const user = contact.github.replace(/\/+$/, '').split('/').pop()
  const [state, setState] = useState(() => cached('github2', 5 * 60e3) ?? { status: 'loading' })
  useEffect(() => {
    if (state.status === 'ok' || state.status === 'empty') return
    let alive = true
    const api = (path) =>
      fetch(`https://api.github.com${path}`).then((r) => {
        if (!r.ok) throw new Error(r.status)
        return r.json()
      })
    api(`/users/${user}/repos?sort=pushed&direction=desc&per_page=5&type=owner`)
      .then(async (repos) => {
        const repo = repos.find((r) => !r.fork) ?? repos[0]
        if (!repo) return { status: 'empty' }
        const commits = await api(`/repos/${repo.full_name}/commits?per_page=30`)
        if (!commits.length) return { status: 'empty' }
        const at = commits[0].commit.committer.date
        // quantos commits foram feitos no mesmo dia do mais recente
        const sameDay = commits.filter((c) => dayKey(c.commit.committer.date) === dayKey(at)).length
        return { status: 'ok', repo: repo.full_name, commits: sameDay, more: sameDay === commits.length, at }
      })
      .then((data) => {
        store('github2', data)
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

// compact = versão do celular: números à esquerda e o texto à direita, numa linha só.
export function CareerBody({ compact = false }) {
  const { t, lang } = useApp()
  const from = new Date(`${career.since}T00:00:00`)
  const { y, m, d } = diffYMD(from, new Date())
  const since = from.toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', { month: 'long', year: 'numeric' })
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex shrink-0 items-end gap-3">
          {[
            [y, widgetText.years],
            [m, widgetText.months],
            [d, widgetText.days],
          ].map(([n, label], i) => (
            <div key={i}>
              <div className="text-2xl font-semibold leading-none">{n}</div>
              <div className="mt-1 text-[10px] opacity-60">{t(label)}</div>
            </div>
          ))}
        </div>
        <p className="min-w-0 text-right text-[11px] leading-tight opacity-80">
          {t(career.sinceText)} {since}
        </p>
      </div>
    )
  }
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

// Humor atual (aparece no cabeçalho do card de necessidades).
export function MoodTag() {
  const { t } = useApp()
  const mood = moodFor(useHour())
  return <span className="ml-auto shrink-0 text-[10px] opacity-70">{t(mood.label)}</span>
}

// Necessidades no estilo do Sims: barras que mudam ao longo do dia (verde = bem, amarelo = atenção, vermelho = crítico).
function StatusBody() {
  const { t } = useApp()
  const hour = useHour()
  return (
    <div className="space-y-1.5">
      {NEEDS.map((n) => {
        const v = needValue(n, hour)
        return (
          <div key={n.id} className="flex items-center gap-2 text-[11px]">
            <span className="w-12 shrink-0 font-medium opacity-80">{t(n.label)}</span>
            <div
              role="progressbar"
              aria-label={t(n.label)}
              aria-valuenow={v}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-ink/15"
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${v}%`, background: needColor(v) }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function GithubBody() {
  const { t, lang } = useApp()
  const g = useGithub()
  if (g.status === 'loading') return <p className="text-xs opacity-70">{t(widgetText.loading)}</p>
  if (g.status === 'error') return <p className="text-xs opacity-70">{t(widgetText.githubError)}</p>
  if (g.status === 'empty') return <p className="text-xs opacity-70">{t(widgetText.githubEmpty)}</p>

  const days = daysBetween(new Date().toISOString(), g.at)
  const when =
    days <= 0
      ? lang === 'en' ? 'today' : 'hoje'
      : days === 1
        ? lang === 'en' ? 'yesterday' : 'ontem'
        : lang === 'en' ? `${days} days ago` : `há ${days} dias`
  const line = t(widgetText.pushed)
    .replace('{n}', g.more ? `${g.commits}+` : g.commits)
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

// Carrega a API do YouTube uma única vez.
let ytApi
const loadYouTubeApi = () => {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (!ytApi) {
    ytApi = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previous?.()
        resolve(window.YT)
      }
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      s.async = true
      s.onerror = () => {
        ytApi = undefined
        reject(new Error('YouTube API indisponível'))
      }
      document.head.appendChild(s)
    })
  }
  return ytApi
}

// Player de música com interface própria. O áudio vem do YouTube: o vídeo fica num iframe de 1×1 pixel,
// invisível, controlado pela API oficial (play/pause, tempo, volume). Nada é baixado.
// compact = versão do celular: capa, título, tocar e uma seta que expande a barra de duração.
export function YouTubeBody({ compact = false }) {
  const { t } = useApp()
  const { id, title, artist } = music.youtube
  const [expanded, setExpanded] = useState(false)
  const host = useRef(null)
  const player = useRef(null)
  const [s, setS] = useState({ ready: false, playing: false, cur: 0, dur: 0, error: false })
  const [vol, setVol] = useState(70)

  useEffect(() => {
    let alive = true
    loadYouTubeApi()
      .then((YT) => {
        if (!alive || !host.current) return
        const mount = document.createElement('div')
        host.current.appendChild(mount) // a API troca este elemento pelo iframe
        player.current = new YT.Player(mount, {
          width: 1,
          height: 1,
          videoId: id,
          playerVars: { controls: 0, disablekb: 1, fs: 0, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3 },
          events: {
            onReady: (e) => {
              e.target.setVolume(70)
              setS((p) => ({ ...p, ready: true, dur: e.target.getDuration() || 0 }))
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.ENDED) {
                e.target.seekTo(0, true)
                e.target.pauseVideo()
                setS((p) => ({ ...p, playing: false, cur: 0 }))
                return
              }
              setS((p) => ({ ...p, playing: e.data === YT.PlayerState.PLAYING, dur: e.target.getDuration() || p.dur }))
            },
            onError: () => setS((p) => ({ ...p, error: true })),
          },
        })
      })
      .catch(() => alive && setS((p) => ({ ...p, error: true })))

    // atualiza a barra enquanto toca
    const timer = setInterval(() => {
      const p = player.current
      if (p?.getCurrentTime) setS((x) => (x.playing ? { ...x, cur: p.getCurrentTime(), dur: p.getDuration() || x.dur } : x))
    }, 400)

    return () => {
      alive = false
      clearInterval(timer)
      try {
        player.current?.destroy()
      } catch {
        /* player já removido */
      }
      player.current = null
    }
  }, [id])

  const toggle = () => {
    const p = player.current
    if (!p || !s.ready) return
    if (s.playing) p.pauseVideo()
    else p.playVideo()
  }
  const seek = (v) => {
    player.current?.seekTo(v, true)
    setS((p) => ({ ...p, cur: v }))
  }
  const changeVolume = (v) => {
    setVol(v)
    player.current?.setVolume(v)
  }
  const stop = (e) => e.stopPropagation()

  return (
    <div className="relative space-y-2.5">
      <div className="flex items-center gap-3">
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          draggable={false}
          className={`shrink-0 rounded-md border border-ink/20 object-cover ${compact ? 'h-10 w-10' : 'h-12 w-12'}`}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{title}</div>
          <div className="truncate text-xs opacity-60">{artist}</div>
        </div>
        <button
          onPointerDown={stop}
          onClick={toggle}
          disabled={!s.ready}
          aria-label={s.playing ? t(ui.pause) : t(ui.play)}
          title={s.playing ? t(ui.pause) : t(ui.play)}
          className={`grid shrink-0 place-items-center rounded-full bg-accent text-card transition disabled:opacity-50 ${
            compact ? 'h-9 w-9' : 'h-10 w-10'
          }`}
        >
          <Icon name={s.playing ? 'pause' : 'play'} size={compact ? 16 : 18} />
        </button>
        {compact && (
          <button
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-label={expanded ? t(ui.close) : t(ui.expand)}
            className="grid h-8 w-8 shrink-0 place-items-center"
          >
            <span className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
              <Icon name="chevron" size={18} />
            </span>
          </button>
        )}
      </div>

      {compact && !expanded ? null : s.error ? (
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noreferrer"
          onPointerDown={stop}
          className="block text-xs text-accent underline-offset-2 hover:underline"
        >
          {t(ui.openYoutube)}
        </a>
      ) : (
        <>
          <div className="flex items-center gap-2 text-[10px] opacity-80">
            <span className="w-8 tabular-nums">{fmt(s.cur)}</span>
            <input
              type="range"
              min="0"
              max={s.dur || 1}
              step="0.5"
              value={Math.min(s.cur, s.dur || 1)}
              disabled={!s.ready}
              onPointerDown={stop}
              onChange={(e) => seek(Number(e.target.value))}
              className="h-1 min-w-0 flex-1 accent-[rgb(var(--c-accent))]"
              aria-label="progress"
            />
            <span className="w-8 text-right tabular-nums">{fmt(s.dur)}</span>
            {/* volume na mesma linha (no celular o volume é o do aparelho) */}
            <span className="flex items-center gap-1 pl-1 max-md:hidden">
              <Icon name="volume" size={13} />
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={vol}
                onPointerDown={stop}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="h-1 w-12 accent-[rgb(var(--c-accent))]"
                aria-label="volume"
              />
            </span>
          </div>
        </>
      )}

      {/* iframe do YouTube: 1×1 pixel, invisível e sem receber cliques */}
      <div ref={host} aria-hidden="true" className="pointer-events-none absolute -left-px -top-px size-px overflow-hidden opacity-0" />
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
        <span className={c.id === 'status' ? 'truncate' : 'flex-1 truncate'}>{t(c.title)}</span>
        {c.id === 'status' && <MoodTag />}
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
