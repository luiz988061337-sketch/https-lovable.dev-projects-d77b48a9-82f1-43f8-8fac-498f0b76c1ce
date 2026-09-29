import { useEffect, useState } from 'react'
import {
  DEFAULT_OVERRIDES,
  DEFAULT_SCHEDULE,
  isOpenNow,
  loadOverrides,
  loadSchedule,
  saveOverrides,
  saveSchedule,
  type DateOverride,
  type DaySchedule,
} from '../data/horarios'

export function useHorarios() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE)
  const [overrides, setOverrides] = useState<DateOverride[]>(DEFAULT_OVERRIDES)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setSchedule(loadSchedule())
    setOverrides(loadOverrides())
    setReady(true)
    // tempo real entre abas: admin altera, /agendar e selo atualizam na hora
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'lmartins-horarios-v1') setSchedule(loadSchedule())
      if (e.key === 'lmartins-excecoes-v1') setOverrides(loadOverrides())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function update(next: DaySchedule[]) {
    setSchedule(next)
    saveSchedule(next)
  }

  function updateOverrides(next: DateOverride[]) {
    setOverrides(next)
    saveOverrides(next)
  }

  return { schedule, update, overrides, updateOverrides, ready }
}

export function useAbertoAgora(schedule: DaySchedule[], overrides: DateOverride[] = []) {
  const [aberto, setAberto] = useState(false)
  useEffect(() => {
    const tick = () => setAberto(isOpenNow(schedule, new Date(), overrides))
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [schedule, overrides])
  return aberto
}

export function StatusBadge({
  schedule,
  overrides = [],
}: {
  schedule: DaySchedule[]
  overrides?: DateOverride[]
}) {
  const aberto = useAbertoAgora(schedule, overrides)
  return (
    <span
      className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold ${
        aberto ? 'bg-[var(--color-wa)] text-black' : 'bg-white/10 text-white/70'
      }`}
    >
      {aberto ? '● ABERTO AGORA' : '○ FECHADO'}
    </span>
  )
}
