import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon'
import Swatches from './Swatches'
import Avatar from './Avatar'
import { cards } from './Widgets'
import { useApp } from '../context'
import { palettes } from '../palettes'
import { credits, cv, profile, ui } from '../data'

function Tab({ icon, label, on, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-current={on ? 'page' : undefined}
      className={`relative flex min-w-0 flex-col items-center justify-center gap-0.5 px-2 text-[11px] transition ${
        on ? 'font-semibold opacity-100' : 'opacity-60'
      }`}
    >
      <Icon name={icon} size={22} />
      <span className="max-w-full truncate">{label}</span>
      {on && <span className="absolute bottom-1.5 h-0.5 w-8 rounded bg-accent" />}
    </button>
  )
}

// Versão para celular: tela inicial com avatar e cards, barra inferior (Início / app aberto / Iniciar),
// menu "Iniciar" que sobe de baixo e cada app abrindo em tela cheia.
export default function MobileShell({ apps }) {
  const { t, lang, setLang, mode, setMode, palette, setPalette } = useApp()
  const [active, setActive] = useState(null)
  const [sheet, setSheet] = useState(false)
  const [showPalettes, setShowPalettes] = useState(false)
  const app = apps.find((a) => a.id === active)

  // o avatar usa o maior quadrado que cabe entre o nome e os cards
  const stage = useRef(null)
  const [size, setSize] = useState(280)
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setSize(Math.max(160, Math.floor(Math.min(r.width, r.height, 380))))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const openApp = (id) => {
    setActive(id)
    setSheet(false)
    setShowPalettes(false)
  }
  const goHome = () => {
    setActive(null)
    setSheet(false)
    setShowPalettes(false)
  }
  const toggleSheet = () => {
    setSheet((s) => !s)
    setShowPalettes(false)
  }

  const visibleCards = cards

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* tela inicial */}
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-6">
        <h1 className="font-display text-[clamp(2.4rem,13vw,3.4rem)] font-bold leading-[0.92] tracking-[-0.025em] text-ink/85">
          Gustavo
          <br />
          Ribas
        </h1>
        <p className="mt-2 text-xs opacity-70">{t(profile.role)}</p>

        <div ref={stage} className="flex min-h-0 flex-1 items-end justify-center overflow-hidden">
          <Avatar size={size} />
        </div>

        {/* cards em carrossel horizontal */}
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-5 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {visibleCards.map((c) => (
            <div
              key={c.id}
              className={`box w-[78vw] max-w-[320px] shrink-0 snap-center overflow-hidden [--depth:5px] ${
                c.id === 'musica' ? '' : 'max-h-[190px]'
              }`}
            >
              <div className="flex items-center gap-1.5 border-b border-ink/10 px-3 py-1.5 text-[11px] font-medium opacity-80">
                <Icon name="grip" size={12} />
                <span className="truncate">{t(c.title)}</span>
              </div>
              <div className="overflow-hidden p-3">
                <c.Body />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* app em tela cheia */}
      <AnimatePresence>
        {app && (
          <motion.section
            key={app.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-20 flex flex-col bg-card"
          >
            <header className="flex items-center gap-3 bg-bar px-4 py-3.5 text-onbar">
              <Icon name={app.icon} size={20} />
              <h2 className="flex-1 truncate text-base font-bold">{t(app.title)}</h2>
              <button onClick={goHome} aria-label={t(ui.close)} className="grid h-8 w-8 place-items-center rounded-lg active:bg-onbar/20">
                <Icon name="x" size={22} />
              </button>
            </header>
            <div className="scroll flex-1 overflow-y-auto p-5 text-[15px] leading-relaxed">
              <app.Body />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* menu Iniciar */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.button
              key="backdrop"
              aria-label={t(ui.close)}
              onClick={() => setSheet(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-black/50"
            />
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="absolute inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 max-h-[80%] overflow-y-auto rounded-t-2xl border border-ink/20 bg-card p-5"
            >
              <div className="mb-3 font-display text-xl font-bold">{profile.name}</div>
              <div className="grid grid-cols-2 gap-x-4">
                {apps.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => openApp(a.id)}
                    className={`flex items-center gap-3 rounded-lg py-3 text-left text-[15px] active:bg-ink/10 ${
                      a.id === active ? 'font-semibold text-accent' : ''
                    }`}
                  >
                    <Icon name={a.icon} size={20} />
                    <span className="truncate">{t(a.title)}</span>
                  </button>
                ))}
              </div>

              <hr className="my-3 border-ink/15" />

              {cv.url && (
                <a
                  href={cv.url}
                  download={cv.filename}
                  className="mb-3 flex items-center gap-3 rounded-lg border border-ink/20 px-3 py-3 text-[15px] font-medium active:bg-ink/10"
                >
                  <Icon name="download" size={20} />
                  {t(ui.downloadCv)}
                </a>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <div role="group" aria-label={t(ui.language)} className="flex overflow-hidden rounded-lg border border-ink/20 text-sm font-bold">
                  {['en', 'pt'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      aria-pressed={lang === l}
                      className={`px-3 py-2 uppercase ${lang === l ? 'bg-ink text-paper' : 'opacity-70'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                  aria-label={t(mode === 'dark' ? ui.lightMode : ui.darkMode)}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-ink/20"
                >
                  <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={18} />
                </button>
                <button
                  onClick={() => setShowPalettes((v) => !v)}
                  aria-label={t(ui.palette)}
                  aria-expanded={showPalettes}
                  className={`grid h-10 w-10 place-items-center rounded-lg border border-ink/20 ${showPalettes ? 'bg-ink text-paper' : ''}`}
                >
                  <Icon name="palette" size={18} />
                </button>
              </div>

              {showPalettes && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {palettes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPalette(p.id)}
                      className={`flex items-center gap-2 rounded-lg border px-2 py-2 text-left text-xs ${
                        p.id === palette ? 'border-accent' : 'border-ink/15'
                      }`}
                    >
                      <Swatches palette={p} size={14} />
                      <span className="flex-1 leading-tight">{t(p.name)}</span>
                      {p.id === palette && <Icon name="check" size={14} />}
                    </button>
                  ))}
                </div>
              )}

              <a
                href={credits.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block text-center text-[11px] opacity-60"
              >
                {t(credits.label)} <span className="font-semibold underline">{credits.name}</span>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* barra inferior */}
      <nav
        className={`relative z-40 grid h-[calc(4rem+env(safe-area-inset-bottom))] shrink-0 border-t border-onbar/15 bg-bar pb-[env(safe-area-inset-bottom)] text-onbar ${
          app ? 'grid-cols-3' : 'grid-cols-2'
        }`}
      >
        <Tab icon="home" label={lang === 'en' ? 'Home' : 'Início'} on={!app && !sheet} onClick={goHome} />
        {app && <Tab icon={app.icon} label={t(app.title)} on={!sheet} onClick={() => setSheet(false)} />}
        <Tab icon="grid" label={t(ui.start)} on={sheet} onClick={toggleSheet} />
      </nav>
    </div>
  )
}
