import { useApp } from '../context'
import { profile, skills, projects, timeline, habits, volunteering, now, contact, ui } from '../data'
import { Face } from './Avatar'
import Icon from './Icon'
import Terminal from './Terminal'

const Tag = ({ children }) => (
  <span className="rounded border border-ink/30 bg-ink/5 px-1.5 py-0.5 text-[10px]">{children}</span>
)

const Label = ({ children }) => (
  <div className="mb-1.5 text-[10px] uppercase tracking-wider opacity-60">{children}</div>
)

export function AboutPanel() {
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

export function ProjectsPanel() {
  const { t } = useApp()
  return (
    <div className="space-y-3">
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
