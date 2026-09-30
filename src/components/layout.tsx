import { Link, useLocation } from '@tanstack/react-router'
import { ADDRESS, WA_AGENDAR_GERAL, WHATSAPP_DISPLAY } from '../data/barbearia'
import { resumoSemana } from '../data/horarios'
import { StatusBadge, useHorarios } from './horarios'

const NAV = [
  { to: '/', label: 'Início' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/produtos', label: 'Produtos' },
  { to: '/galeria', label: 'Galeria' },
  { to: '/agendar', label: 'Agendar' },
  { to: '/contato', label: 'Contato' },
] as const

export function Navbar() {
  const loc = useLocation()
  const { schedule, overrides } = useHorarios()
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="glass-strong">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-brass)] font-display text-lg text-black">
                L
              </div>
              <div className="leading-tight">
                <p className="font-display text-lg tracking-wide">L MARTINS</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brass)]">
                  Barbearia
                </p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((n) => {
                const active = loc.pathname === n.to
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`rounded-full px-3 py-2 text-sm transition ${
                      active
                        ? 'bg-[var(--color-brass)] text-black font-semibold'
                        : 'text-[var(--color-cream)]/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {n.label}
                  </Link>
                )
              })}
            </nav>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <StatusBadge schedule={schedule} overrides={overrides} />
              </div>
              <a
                href={WA_AGENDAR_GERAL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[var(--color-wa)] px-4 py-2 text-sm font-bold text-black hover:brightness-110"
              >
                Agendar
              </a>
            </div>
          </div>
          <nav className="flex md:hidden items-center gap-1 overflow-x-auto pb-3">
            {NAV.map((n) => {
              const active = loc.pathname === n.to
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition ${
                    active
                      ? 'bg-[var(--color-brass)] text-black font-semibold'
                      : 'text-[var(--color-cream)]/80 bg-white/5'
                  }`}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  const { schedule, overrides } = useHorarios()
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">L MARTINS</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-brass)] mt-1">
            Barbearia • desde o corte clássico
          </p>
          <p className="mt-4 text-sm text-white/70">
            {ADDRESS}
            <br />
            {resumoSemana(schedule)}
          </p>
          <div className="mt-3">
            <StatusBadge schedule={schedule} overrides={overrides} />
          </div>
        </div>
        <div className="text-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Navegar</p>
          <div className="mt-3 flex flex-col gap-2">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="text-white/80 hover:text-[var(--color-brass)]">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Agendar</p>
          <p className="mt-3 text-white/80">WhatsApp {WHATSAPP_DISPLAY}</p>
          <a
            href={WA_AGENDAR_GERAL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block rounded-full bg-[var(--color-wa)] px-5 py-2.5 font-bold text-black"
          >
            Chamar no WhatsApp
          </a>
          <p className="mt-3 font-mono text-[11px] text-white/40">
            Sem loja online — pedido e agendamento direto no WhatsApp.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 font-mono text-[11px]">
            <Link to="/pedido" className="underline hover:text-[var(--color-brass)]">sacola</Link>
            <Link to="/meus-pedidos" className="underline hover:text-[var(--color-brass)]">meus pedidos</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center font-mono text-[11px] text-white/40">
        © {new Date().getFullYear()} L MARTINS Barbearia — site vitrine + WhatsApp •{' '}
        <Link to="/admin/horarios" className="hover:text-[var(--color-brass)]">
          gerenciar horários
        </Link>{' '}•{' '}
        <Link to="/admin/catalogo" className="hover:text-[var(--color-brass)]">
          catálogo
        </Link>{' '}•{' '}
        <Link to="/admin/pedidos" className="hover:text-[var(--color-brass)]">
          pedidos
        </Link>{' '}
        • fotos: Unsplash
      </div>
    </footer>
  )
}

export function WhatsAppButton({
  href,
  label,
  small,
}: {
  href: string
  label: string
  small?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-wa)] font-bold text-black hover:brightness-110 active:scale-[0.98] transition ${
        small ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base'
      }`}
    >
      <span aria-hidden>◉</span> {label}
    </a>
  )
}

export function GhostButton({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-full border border-[var(--color-brass)]/50 px-6 py-3 text-base font-semibold text-[var(--color-brass)] hover:bg-[var(--color-brass)]/10"
    >
      {label}
    </Link>
  )
}

/* Título de seção padronizado: kicker mono + display + linha dourada */
export function SectionHead({
  kicker,
  title,
  link,
}: {
  kicker: string
  title: string
  link?: { to: string; label: string }
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-brass)]">
        {kicker}
      </p>
      <div className="mt-1 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
        {link && (
          <Link
            to={link.to}
            className="shrink-0 font-mono text-xs text-[var(--color-brass)] hover:underline"
          >
            {link.label} →
          </Link>
        )}
      </div>
      <div className="rule-gold mt-3 w-40" />
    </div>
  )
}

/* Faixa corrida dourada estilo barbearia */
export function Marquee() {
  const items = ['CORTE DEGRADÊ', 'BARBA NAVALHA', 'TOALHA QUENTE', 'PIGMENTAÇÃO', 'TESOURA', 'ESTILO']
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-[var(--color-brass)]/30 bg-black/40 py-3">
      <div className="marquee-track flex w-max items-center gap-8">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-lg tracking-wide">
            <span className="gold-text">{t}</span>
            <span className="text-[var(--color-brass)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* Faixa final de chamada para o WhatsApp */
export function CTABand() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <div className="glass relative overflow-hidden rounded-3xl p-8 md:p-12 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 50% 120%, var(--color-brass), transparent)',
          }}
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-brass)]">
          Vaga hoje? Chama direto
        </p>
        <h2 className="font-display mt-2 text-3xl md:text-5xl">
          PRONTO PARA RENOVAR <span className="gold-text">O VISUAL?</span>
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <WhatsAppButton href={WA_AGENDAR_GERAL} label="Agendar pelo WhatsApp" />
          <GhostButton to="/agendar" label="Escolher dia e hora" />
        </div>
      </div>
    </section>
  )
}
