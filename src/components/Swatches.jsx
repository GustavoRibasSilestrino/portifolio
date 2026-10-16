// As 4 cores de uma paleta, cada uma em seu quadradinho, com contorno que aparece no tema claro e no escuro.
export default function Swatches({ palette, size = 20 }) {
  return (
    <span className="flex shrink-0 gap-1" aria-hidden="true">
      {[palette.ink, palette.mid, palette.bg, palette.accent].map((color, i) => (
        <span
          key={i}
          style={{ background: color, width: size, height: size }}
          className="rounded-md ring-1 ring-inset ring-ink/35"
        />
      ))}
    </span>
  )
}
