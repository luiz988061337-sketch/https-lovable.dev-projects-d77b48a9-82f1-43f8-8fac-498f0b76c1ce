import { createFileRoute, Link } from '@tanstack/react-router'
import { WhatsAppButton } from '../components/layout'
import { ADDRESS, MAPS_URL, WA_AGENDAR_GERAL, WHATSAPP_DISPLAY, waLink } from '../data/barbearia'
import { TIME_SLOTS } from '../data/horarios'
import { StatusBadge, useHorarios } from '../components/horarios'

export const Route = createFileRoute('/contato')({
  head: () => ({
    meta: [
      { title: 'Contato — L MARTINS Barbearia' },
      {
        name: 'description',
        content: 'Endereço, horários e WhatsApp da L MARTINS Barbearia. Agende de segunda a sábado.',
      },
      { property: 'og:title', content: 'Contato L MARTINS' },
    ],
  }),
  component: Contato,
})

function Contato() {
  const { schedule, overrides } = useHorarios()
  const proximasExcecoes = overrides.slice(0, 5)
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">Onde nos achar</p>
      <h1 className="font-display mt-2 text-4xl md:text-6xl">CONTATO</h1>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl">ENDEREÇO</h2>
            <StatusBadge schedule={schedule} overrides={overrides} />
          </div>
          <p className="mt-2 text-lg">{ADDRESS}</p>
          <p className="mt-1 font-mono text-xs text-white/50">Confirmar cidade com o usuário</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--color-brass)]/50 px-5 py-2.5 font-semibold text-[var(--color-brass)] hover:bg-[var(--color-brass)]/10"
            >
              Abrir no Google Maps
            </a>
            <Link
              to="/agendar"
              className="rounded-full bg-[var(--color-wa)] px-5 py-2.5 font-bold text-black"
            >
              Escolher dia e hora
            </Link>
          </div>
          <h2 className="font-display mt-8 text-2xl">HORÁRIO DA SEMANA</h2>
          <p className="font-mono text-[11px] text-white/50">10h às 19h • verde = livre, riscado = off</p>
          <div className="mt-3 grid gap-2">
            {schedule.map((d) => (
              <div key={d.dow} className="rounded-xl bg-black/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {d.label}{' '}
                    <span className={`font-mono text-[11px] ${d.enabled ? 'text-[var(--color-wa)]' : 'text-white/40'}`}>
                      {d.enabled ? '' : '• fechado'}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-white/50">
                    {d.enabled ? `${TIME_SLOTS.length - d.offSlots.length} livres` : '—'}
                  </span>
                </div>
                {d.enabled && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {TIME_SLOTS.map((s) => {
                      const off = d.offSlots.includes(s)
                      return (
                        <span
                          key={s}
                          className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${
                            off
                              ? 'bg-white/5 text-white/30 line-through'
                              : 'bg-[var(--color-wa)]/15 text-[var(--color-wa)]'
                          }`}
                        >
                          {s}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[11px] text-white/40">
            Dono: para abrir/fechar, vá em <Link to="/admin/horarios" className="underline">gerenciar horários</Link>.
          </p>
          {proximasExcecoes.length > 0 && (
            <div className="mt-4 rounded-xl border border-[var(--color-brass)]/30 bg-[var(--color-brass)]/5 p-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-brass)]">
                Exceções / feriados
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {proximasExcecoes.map((o) => (
                  <p key={o.date} className="text-sm text-white/80">
                    <span className="font-mono text-xs">{o.date}</span> — {o.label} •{' '}
                    <span className={o.enabled ? 'text-[var(--color-wa)]' : 'text-white/50'}>
                      {o.enabled ? `${TIME_SLOTS.length - o.offSlots.length} horas livres` : 'fechado'}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-2xl">WHATSAPP</h2>
          <p className="mt-2 text-lg">{WHATSAPP_DISPLAY}</p>
          <p className="mt-1 text-sm text-white/60">
            Agendamento e pedidos de produtos — resposta rápida no horário de funcionamento.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <WhatsAppButton href={WA_AGENDAR_GERAL} label="Agendar horário" />
            <WhatsAppButton
              href={waLink('Olá, L MARTINS! Quero ver os produtos disponíveis.')}
              label="Perguntar sobre produtos"
            />
          </div>
          <div className="mt-6 rounded-xl bg-black/30 p-4 font-mono text-xs text-white/60">
            Dica: salve o contato como “L MARTINS Barbearia” para agendar mais rápido na próxima vez.
          </div>
        </div>
      </div>
    </div>
  )
}
