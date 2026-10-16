import { useApp } from '../context'
import { profile, skills, projects, featured, timeline, habits, volunteering, now, contact, ui } from '../data'
import { Face } from './Avatar'
import Icon from './Icon'
import Terminal from './Terminal'

const Tag = ({ children }) => (
  <span className="rounded border border-ink/30 bg-ink/5 px-1.5 py-0.5 text-[10px]">{children}</span>
)

const Label = ({ children }) => (
  <div className="mb-1.5 text-[10px] uppercase tracking-wider opacity-60">{children}</div>
)

export function AboutPanel({ onOpen }) {
  const { t } = useApp()
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="box h-24 w-24 shrink-0 overflow-hidden bg-accent/15">
          <Face className="h-full w-full" />
        </div>
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent px-2.5 py-0.5 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {t(profile.status)}
          </span>
          <h2 className="mt-2 text-2xl font-bold leading-tight">{t(profile.hello)}</h2>
          <p className="text-sm opacity-70">{t(profile.headline)}</p>
        </div>
      </div>

      {/* destaque: abre o estudo de caso em "Projetos" */}
      <button
        onClick={() => onOpen?.('projetos')}
        className="box mb-1 mr-1.5 flex w-full items-center gap-3 !border-accent/60 px-3 py-2.5 text-left transition [--depth:4px] hover:!bg-accent/10"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-card">
          <Icon name="trophy" size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-tight">
            {featured.name} · {t(featured.awardShort)}
          </span>
          <span className="block text-xs opacity-70">{t(ui.seeCase)}</span>
        </span>
        <span className="shrink-0 -rotate-90 text-accent">
          <Icon name="chevron" size={18} />
        </span>
      </button>

      <div className="space-y-3">
        {profile.about.map((p, i) => (
          <p key={i}>{t(p)}</p>
        ))}
      </div>

      <hr className="border-ink/20" />

      <div className="space-y-3">
        <Label>{t(ui.stack)}</Label>
        {skills.map((g, i) => (
          <div key={i}>
            <div className="mb-1 text-xs font-semibold opacity-70">{t(g.group)}</div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((it, j) => (
                <Tag key={j}>{t(it)}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ExperiencePanel() {
  const { t } = useApp()
  return (
    <div className="space-y-5 border-l-2 border-accent/60 pl-4">
      {timeline.map((item, i) => (
        <div key={i}>
          <div className="text-[10px] uppercase opacity-60">{t(item.when)}</div>
          <div className="font-bold">{t(item.title)}</div>
          <div className="text-xs opacity-70">{t(item.where)}</div>
          <p className="mt-1">{t(item.text)}</p>
        </div>
      ))}
    </div>
  )
}

const LinkButton = ({ href, icon, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-2 rounded-md border border-ink/30 px-3 py-1.5 text-xs font-semibold transition hover:bg-ink hover:text-paper"
  >
    <Icon name={icon} size={14} />
    {children}
  </a>
)

// Estudo de caso do projeto em destaque (Finsight): objetivo, o que faz, tecnologias, papel e links.
function FeaturedCase() {
  const { t } = useApp()
  const f = featured
  return (
    <article className="box mb-1 mr-1.5 space-y-4 !border-accent/60 p-4 [--depth:6px]">
      <header className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-card">
          <Icon name="trophy" size={22} />
        </span>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-accent">{t(ui.caseStudy)}</div>
          <h3 className="font-display text-2xl font-bold leading-none">{f.name}</h3>
          <p className="mt-1 text-xs opacity-70">{t(f.tagline)}</p>
        </div>
      </header>

      <div className="inline-flex items-center gap-2 rounded-full border border-accent px-3 py-1 text-xs font-semibold">
        <Icon name="trophy" size={13} />
        {t(f.award)}
      </div>

      <section>
        <Label>{t(ui.problem)}</Label>
        <p>{t(f.problem)}</p>
      </section>

      <section>
        <Label>{t(ui.whatItDoes)}</Label>
        <ul className="grid gap-1 sm:grid-cols-2">
          {f.features.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] leading-snug">
              <span className="mt-0.5 shrink-0 text-accent">
                <Icon name="check" size={14} />
              </span>
              {t(item)}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Label>{t(ui.techs)}</Label>
        <div className="flex flex-wrap gap-1.5">
          {f.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </section>

      <section>
        <Label>{t(ui.myRole)}</Label>
        <p>{t(f.role)}</p>
        {t(f.roleDetail) && <p className="mt-1 opacity-90">{t(f.roleDetail)}</p>}
      </section>

      <div className="flex flex-wrap gap-2 pt-1">
        <LinkButton href={f.links.demo} icon="external">
          {t(ui.viewOnline)}
        </LinkButton>
        <LinkButton href={f.links.code} icon="terminal">
          {t(ui.viewCode)}
        </LinkButton>
      </div>
    </article>
  )
}

export function ProjectsPanel() {
  const { t } = useApp()
  return (
    <div className="space-y-3">
      <FeaturedCase />
      <div className="pt-2">
        <Label>{t(ui.otherProjects)}</Label>
      </div>
      {projects.map((p, i) => (
        <div key={i} className="box mb-1 mr-1.5 p-3 [--depth:5px]">
          <div className="font-bold">{t(p.name)}</div>
          <p className="my-1 text-xs opacity-80">{t(p.desc)}</p>
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function WorkPanel() {
  const { t } = useApp()
  return (
    <div className="space-y-4">
      <p className="opacity-70">{t(habits.intro)}</p>
      {habits.items.map((h, i) => (
        <div key={i}>
          <h3 className="text-base font-bold">{t(h.title)}</h3>
          <p className="opacity-80">{t(h.text)}</p>
        </div>
      ))}
    </div>
  )
}

export function VolunteerPanel() {
  const { t } = useApp()
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-accent">
        <Icon name="heart" size={20} />
      </span>
      <p>{t(volunteering.text)}</p>
    </div>
  )
}

export function NowPanel() {
  const { t } = useApp()
  return (
    <div className="space-y-4">
      <div className="text-[10px] uppercase opacity-60">{t(now.updated)}</div>
      {now.items.map((it, i) => (
        <div key={i} className="flex gap-3 border-b border-ink/15 pb-3 last:border-0">
          <span className="w-24 shrink-0 text-xs font-semibold uppercase">{t(it.label)}</span>
          <span>{t(it.text)}</span>
        </div>
      ))}
    </div>
  )
}

export function ContactPanel() {
  const { t } = useApp()
  const links = [
    { label: contact.email, href: `mailto:${contact.email}`, icon: 'mail' },
    { label: 'GitHub', href: contact.github, icon: 'terminal' },
    contact.linkedin && { label: 'LinkedIn', href: contact.linkedin, icon: 'user' },
  ].filter(Boolean)
  return (
    <div className="space-y-3">
      <p>{t(contact.intro)}</p>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noreferrer"
          className="box mb-1 mr-1.5 flex items-center gap-2 px-3 py-2 font-medium transition [--depth:5px] hover:!bg-ink hover:text-paper"
        >
          <Icon name={l.icon} size={16} />
          {l.label}
        </a>
      ))}
    </div>
  )
}

export { Terminal as TerminalPanel }
