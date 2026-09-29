import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  DEFAULT_OVERRIDES,
  DEFAULT_SCHEDULE,
  TIME_SLOTS,
  toISODate,
  type DateOverride,
  type DaySchedule,
  type TimeSlot,
} from '../../data/horarios'
import { useHorarios } from '../../components/horarios'

export const Route = createFileRoute('/admin/horarios')({
  head: () => ({
    meta: [
      { title: 'Gerenciar horários — L MARTINS (dono)' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: AdminHorarios,
})

function AdminHorarios() {
  const { schedule, update, overrides, updateOverrides, ready } = useHorarios()
  const [copiado, setCopiado] = useState(false)
  const [novaData, setNovaData] = useState(toISODate(new Date()))
  const [novoMotivo, setNovoMotivo] = useState('Feriado')

  function toggleDia(dow: number) {
    update(schedule.map((d) => (d.dow === dow ? { ...d, enabled: !d.enabled } : d)))
  }

  function toggleSlot(dow: number, slot: TimeSlot) {
    update(
      schedule.map((d) => {
        if (d.dow !== dow) return d
        const off = d.offSlots.includes(slot)
        return {
          ...d,
          offSlots: off ? d.offSlots.filter((s) => s !== slot) : [...d.offSlots, slot],
        }
      }),
    )
  }

  function liberarDia(dow: number) {
    update(schedule.map((d) => (d.dow === dow ? { ...d, offSlots: [] } : d)))
  }

  function fecharDia(dow: number) {
    update(
      schedule.map((d) =>
        d.dow === dow ? { ...d, offSlots: [...TIME_SLOTS] as TimeSlot[] } : d,
      ),
    )
  }

  function reset() {
    update(DEFAULT_SCHEDULE.map((d) => ({ ...d, offSlots: [...d.offSlots] })))
    updateOverrides(DEFAULT_OVERRIDES.map((o) => ({ ...o, offSlots: [...o.offSlots] })))
  }

  function addExcecao() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(novaData)) return
    const label = novoMotivo.trim() || 'Fechado'
    const next: DateOverride[] = overrides.some((o) => o.date === novaData)
      ? overrides.map((o) => (o.date === novaData ? { ...o, label } : o))
      : [...overrides, { date: novaData, label, enabled: false, offSlots: [] }]
    updateOverrides(next)
  }

  function toggleExcecao(date: string) {
    updateOverrides(
      overrides.map((o) => (o.date === date ? { ...o, enabled: !o.enabled } : o)),
    )
  }

  function toggleExcecaoSlot(date: string, slot: TimeSlot) {
    updateOverrides(
      overrides.map((o) => {
        if (o.date !== date) return o
        const off = o.offSlots.includes(slot)
        return {
          ...o,
          enabled: true,
          offSlots: off ? o.offSlots.filter((s) => s !== slot) : [...o.offSlots, slot],
        }
      }),
    )
  }

  function removerExcecao(date: string) {
    updateOverrides(overrides.filter((o) => o.date !== date))
  }

  async function copiarJSON() {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify({ schedule, overrides }, null, 2),
      )
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setCopiado(false)
    }
  }

  if (!ready) return <p className="mx-auto max-w-6xl px-4 py-8">Carregando…</p>

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
        Área do dono • sem login • tempo real neste navegador
      </p>
      <h1 className="font-display mt-2 text-4xl md:text-5xl">DISPONIBILIDADE</h1>
      <p className="mt-3 max-w-2xl text-white/70">
        1) Ligue/desligue dias e horas da semana. 2) Adicione exceções por data (feriado, folga).
        Tudo reflete na hora em <b>/agendar</b>, selo ABERTO/FECHADO e <b>/contato</b>.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={reset} className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-[var(--color-brass)]">
          Resetar padrão
        </button>
        <button onClick={copiarJSON} className="rounded-full bg-[var(--color-brass)] px-4 py-2 text-sm font-bold text-black">
          {copiado ? 'Copiado!' : 'Copiar JSON (schedule + overrides)'}
        </button>
      </div>

      {/* EXCEÇÕES */}
      <section className="glass mt-6 rounded-2xl p-5">
        <h2 className="font-display text-2xl">EXCEÇÕES POR DATA</h2>
        <p className="font-mono text-[11px] text-white/50">Ex.: 2026-10-12 fechado • 2026-12-24 meio período</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="date"
            value={novaData}
            onChange={(e) => setNovaData(e.target.value)}
            className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm"
          />
          <input
            value={novoMotivo}
            onChange={(e) => setNovoMotivo(e.target.value)}
            placeholder="Motivo (Feriado…)"
            className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm min-w-52"
          />
          <button onClick={addExcecao} className="rounded-full bg-[var(--color-wa)] px-4 py-2 text-sm font-bold text-black">
            + Fechar essa data
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {overrides.length === 0 && (
            <p className="font-mono text-xs text-white/40">Nenhuma exceção. Ex.: adicione 2026-10-12.</p>
          )}
          {overrides.map((o) => (
            <div key={o.date} className="rounded-xl bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold">
                  {o.date} — {o.label}{' '}
                  <span className={`font-mono text-[11px] ${o.enabled ? 'text-[var(--color-wa)]' : 'text-white/40'}`}>
                    {o.enabled ? 'ABERTO PARCIAL' : 'FECHADO'}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button onClick={() => toggleExcecao(o.date)} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px]">
                    {o.enabled ? 'fechar dia' : 'abrir parcial'}
                  </button>
                  <button onClick={() => removerExcecao(o.date)} className="rounded-full border border-red-400/40 px-3 py-1 font-mono text-[11px] text-red-300">
                    excluir
                  </button>
                </div>
              </div>
              {o.enabled && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                  {TIME_SLOTS.map((s) => {
                    const off = o.offSlots.includes(s)
                    return (
                      <button
                        key={s}
                        onClick={() => toggleExcecaoSlot(o.date, s)}
                        className={`rounded-lg border p-2 font-mono text-xs ${off ? 'border-white/5 text-white/30 line-through' : 'border-[var(--color-wa)]/40 text-white'}`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SEMANA */}
      <div className="mt-6 grid gap-4">
        {schedule.map((d) => (
          <div key={d.dow} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleDia(d.dow)}
                  className={`relative h-7 w-12 rounded-full transition ${d.enabled ? 'bg-[var(--color-wa)]' : 'bg-white/15'}`}
                  aria-label={`Alternar ${d.label}`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-black transition-all ${d.enabled ? 'left-6' : 'left-1 bg-white'}`}
                  />
                </button>
                <div>
                  <h2 className="font-display text-xl">
                    {d.label}{' '}
                    <span className={`font-mono text-xs ${d.enabled ? 'text-[var(--color-wa)]' : 'text-white/40'}`}>
                      {d.enabled ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
                    </span>
                  </h2>
                </div>
              </div>
              {d.enabled && (
                <div className="flex gap-2">
                  <button onClick={() => liberarDia(d.dow)} className="rounded-full border border-[var(--color-wa)]/50 px-3 py-1.5 font-mono text-[11px] text-[var(--color-wa)]">
                    liberar tudo
                  </button>
                  <button onClick={() => fecharDia(d.dow)} className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] text-white/60">
                    fechar tudo
                  </button>
                </div>
              )}
            </div>

            {d.enabled && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {TIME_SLOTS.map((s) => {
                  const off = d.offSlots.includes(s)
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSlot(d.dow, s)}
                      className={`rounded-xl border p-2.5 font-mono text-sm transition ${
                        off
                          ? 'border-white/5 bg-black/30 text-white/30 line-through'
                          : 'border-[var(--color-wa)]/40 bg-[var(--color-wa)]/10 text-white hover:bg-[var(--color-wa)]/20'
                      }`}
                    >
                      {s}
                      <span className="block text-[10px] opacity-70">{off ? 'off' : 'on'}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
