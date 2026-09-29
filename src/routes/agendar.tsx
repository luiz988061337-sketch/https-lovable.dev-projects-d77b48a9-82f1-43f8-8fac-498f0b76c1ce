import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SERVICES, waLink } from '../data/barbearia'
import { getOverride, slotsLivresParaData, toISODate, type TimeSlot } from '../data/horarios'
import { useHorarios } from '../components/horarios'

export const Route = createFileRoute('/agendar')({
  head: () => ({
    meta: [
      { title: 'Agendar horário — L MARTINS Barbearia' },
      {
        name: 'description',
        content: 'Escolha serviço, dia e hora livres e confirme pelo WhatsApp.',
      },
    ],
  }),
  component: Agendar,
})

function Agendar() {
  const { schedule, overrides, ready } = useHorarios()
  const [servicoId, setServicoId] = useState(SERVICES[5].id)
  const [diaIdx, setDiaIdx] = useState(0)
  const [hora, setHora] = useState<string | null>(null)

  const dias = useMemo(() => {
    const now = new Date()
    const out: {
      date: Date
      iso: string
      label: string
      motivo: string | null
      lista: TimeSlot[]
      livres: number
    }[] = []
    for (let i = 0; i < 14; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      const iso = toISODate(d)
      const ov = getOverride(overrides, iso)
      const livres = slotsLivresParaData(schedule, overrides, d).filter((s) => {
        if (i !== 0) return true
        const [h, m] = s.split(':').map(Number)
        return h * 60 + m > now.getHours() * 60 + now.getMinutes()
      })
      const label =
        i === 0
          ? 'Hoje'
          : i === 1
            ? 'Amanhã'
            : d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
      out.push({
        date: d,
        iso,
        label: ov && !ov.enabled ? `${label} • ${ov.label}` : label,
        motivo: ov ? ov.label : null,
        lista: livres,
        livres: livres.length,
      })
    }
    return out
  }, [schedule, overrides])

  const diaSel = dias[diaIdx]
  const servico = SERVICES.find((s) => s.id === servicoId)!

  const link = hora
    ? waLink(
        `Olá, L MARTINS! Quero agendar: ${servico.nome} — ${diaSel.label} (${diaSel.iso}) às ${hora}. Pode confirmar?`,
      )
    : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
        Passo a passo • sem cadastro
      </p>
      <h1 className="font-display mt-2 text-4xl md:text-6xl">AGENDAR</h1>
      <p className="mt-3 max-w-xl text-white/70">
        Dias e horas indisponíveis — incluindo feriados e exceções — ficam bloqueados
        automaticamente. A confirmação final é no WhatsApp.
      </p>

      {!ready ? (
        <p className="mt-8 font-mono text-sm text-white/50">Carregando horários…</p>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-xl">1 • SERVIÇO</h2>
            <select
              value={servicoId}
              onChange={(e) => setServicoId(e.target.value)}
              className="mt-3 w-full rounded-xl bg-black/40 border border-white/10 p-3 text-sm"
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} — R$ {s.preco}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-white/60">{servico.desc}</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-xl">2 • DIA</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {dias.map((d, i) => {
                const off = d.livres === 0
                return (
                  <button
                    key={d.iso}
                    disabled={off}
                    onClick={() => {
                      setDiaIdx(i)
                      setHora(null)
                    }}
                    className={`rounded-xl border p-2.5 text-left text-sm transition ${
                      i === diaIdx
                        ? 'border-[var(--color-brass)] bg-[var(--color-brass)]/15 font-bold'
                        : off
                          ? 'border-white/5 bg-black/20 text-white/30 line-through'
                          : 'border-white/10 bg-black/30 hover:border-[var(--color-brass)]/50'
                    }`}
                  >
                    <span className="block">{d.label}</span>
                    <span className="font-mono text-[11px] opacity-70">
                      {off ? 'indisponível' : `${d.livres} livres`}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-xl">3 • HORA</h2>
            {diaSel.livres === 0 ? (
              <p className="mt-3 text-sm text-white/60">
                Nenhum horário livre nesse dia{diaSel.motivo ? ` (${diaSel.motivo})` : ''}. Escolha
                outro dia.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {diaSel.lista.map((s) => (
                  <button
                    key={s}
                    onClick={() => setHora(s)}
                    className={`rounded-xl border p-2 font-mono text-sm transition ${
                      hora === s
                        ? 'border-[var(--color-wa)] bg-[var(--color-wa)] text-black font-bold'
                        : 'border-white/10 bg-black/30 hover:border-[var(--color-wa)]/60'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-5">
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-wa)] px-5 py-3 font-bold text-black hover:brightness-110"
                >
                  Confirmar {diaSel.label} às {hora} →
                </a>
              ) : (
                <p className="font-mono text-xs text-white/40">
                  Escolha dia e hora para liberar o botão.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
