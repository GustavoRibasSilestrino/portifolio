import { createContext, useContext, useEffect, useState } from 'react'
import { applyPalette, defaultMode, defaultPalette, palettes } from './palettes'

const Ctx = createContext(null)

const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* sem armazenamento: ignora */
  }
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => (read('lang', 'pt') === 'en' ? 'en' : 'pt'))
  const [mode, setMode] = useState(() => (read('mode', defaultMode) === 'light' ? 'light' : 'dark'))
  const [palette, setPalette] = useState(() => {
    const saved = read('palette', defaultPalette)
    return palettes.some((p) => p.id === saved) ? saved : defaultPalette
  })

  useEffect(() => {
    applyPalette(palette, mode)
    write('palette', palette)
    write('mode', mode)
  }, [palette, mode])

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR'
    write('lang', lang)
  }, [lang])

  // t: devolve o texto no idioma atual (aceita string simples ou { pt, en })
  const t = (v) => (v && typeof v === 'object' ? v[lang] : v)

  return <Ctx.Provider value={{ lang, setLang, mode, setMode, palette, setPalette, t }}>{children}</Ctx.Provider>
}

export const useApp = () => useContext(Ctx)
