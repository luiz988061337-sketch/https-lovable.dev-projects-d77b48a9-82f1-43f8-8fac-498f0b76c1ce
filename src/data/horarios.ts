// Controle de disponibilidade — sem backend.
// Fonte padrão = seg a sáb 10h-19h. Dono ajusta em /admin/horarios (salva no navegador).
// Para virar padrão do deploy, copie o JSON gerado no admin para DEFAULT_SCHEDULE / DEFAULT_OVERRIDES.

export const TIME_SLOTS = [
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
] as const

export type TimeSlot = (typeof TIME_SLOTS)[number]

export type DaySchedule = {
  dow: number // 0=dom ... 6=sab
  label: string
  short: string
  enabled: boolean
  offSlots: TimeSlot[] // horas indisponíveis nesse dia
}

export type DateOverride = {
  date: string // YYYY-MM-DD
  label: string // ex: "Feriado N. Sra."
  enabled: boolean // false = fechado o dia todo
  offSlots: TimeSlot[]
}

export const DEFAULT_SCHEDULE: DaySchedule[] = [
  { dow: 0, label: 'Domingo', short: 'DOM', enabled: false, offSlots: [] },
  { dow: 1, label: 'Segunda', short: 'SEG', enabled: true, offSlots: [] },
  { dow: 2, label: 'Terça', short: 'TER', enabled: true, offSlots: [] },
  { dow: 3, label: 'Quarta', short: 'QUA', enabled: true, offSlots: [] },
  { dow: 4, label: 'Quinta', short: 'QUI', enabled: true, offSlots: [] },
  { dow: 5, label: 'Sexta', short: 'SEX', enabled: true, offSlots: [] },
  { dow: 6, label: 'Sábado', short: 'SÁB', enabled: true, offSlots: [] },
]

export const DEFAULT_OVERRIDES: DateOverride[] = [
  { date: '2026-10-12', label: 'Feriado N. Sra. Aparecida', enabled: false, offSlots: [] },
]

export const STORAGE_KEY = 'lmartins-horarios-v1'
export const OVERRIDES_KEY = 'lmartins-excecoes-v1'

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function loadSchedule(): DaySchedule[] {
  if (typeof window === 'undefined') return DEFAULT_SCHEDULE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SCHEDULE
    const parsed = JSON.parse(raw) as DaySchedule[]
    return DEFAULT_SCHEDULE.map((def) => {
      const found = parsed.find((p) => p.dow === def.dow)
      if (!found) return def
      return {
        ...def,
        enabled: !!found.enabled,
        offSlots: (found.offSlots ?? []).filter((s): s is TimeSlot =>
          (TIME_SLOTS as readonly string[]).includes(s),
        ),
      }
    })
  } catch {
    return DEFAULT_SCHEDULE
  }
}

export function saveSchedule(s: DaySchedule[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    // ignora
  }
}

export function loadOverrides(): DateOverride[] {
  if (typeof window === 'undefined') return DEFAULT_OVERRIDES
  try {
    const raw = window.localStorage.getItem(OVERRIDES_KEY)
    if (!raw) return DEFAULT_OVERRIDES
    const parsed = JSON.parse(raw) as DateOverride[]
    return parsed
      .filter((o) => /^\d{4}-\d{2}-\d{2}$/.test(o.date))
      .map((o) => ({
        date: o.date,
        label: String(o.label ?? '').slice(0, 60),
        enabled: !!o.enabled,
        offSlots: (o.offSlots ?? []).filter((s): s is TimeSlot =>
          (TIME_SLOTS as readonly string[]).includes(s),
        ),
      }))
      .sort((a, b) => (a.date < b.date ? -1 : 1))
  } catch {
    return DEFAULT_OVERRIDES
  }
}

export function saveOverrides(o: DateOverride[]) {
  try {
    window.localStorage.setItem(
      OVERRIDES_KEY,
      JSON.stringify([...o].sort((a, b) => (a.date < b.date ? -1 : 1))),
    )
  } catch {
    // ignora
  }
}

export function getOverride(overrides: DateOverride[], iso: string): DateOverride | undefined {
  return overrides.find((o) => o.date === iso)
}

export function isSlotAvailable(schedule: DaySchedule[], dow: number, slot: string) {
  const day = schedule.find((d) => d.dow === dow)
  if (!day || !day.enabled) return false
  return !day.offSlots.includes(slot as TimeSlot)
}

// Versão com exceção por data: override vence a regra semanal
export function slotsLivresParaData(
  schedule: DaySchedule[],
  overrides: DateOverride[],
  date: Date,
): TimeSlot[] {
  const iso = toISODate(date)
  const ov = getOverride(overrides, iso)
  if (ov) {
    if (!ov.enabled) return []
    return TIME_SLOTS.filter((s) => !ov.offSlots.includes(s))
  }
  return slotsLivresDoDia(schedule, date.getDay())
}

export function slotsLivresDoDia(schedule: DaySchedule[], dow: number): TimeSlot[] {
  const day = schedule.find((d) => d.dow === dow)
  if (!day || !day.enabled) return []
  return TIME_SLOTS.filter((s) => !day.offSlots.includes(s))
}

export function isOpenNow(
  schedule: DaySchedule[],
  now = new Date(),
  overrides: DateOverride[] = [],
): boolean {
  const iso = toISODate(now)
  const ov = getOverride(overrides, iso)
  const mins = now.getHours() * 60 + now.getMinutes()
  if (mins < 10 * 60 || mins >= 19 * 60) return false
  const hh = now.getHours().toString().padStart(2, '0')
  const slotHora = `${hh}:00` as TimeSlot
  if (ov) {
    if (!ov.enabled) return false
    return !ov.offSlots.includes(slotHora)
  }
  const day = schedule.find((d) => d.dow === now.getDay())
  if (!day || !day.enabled) return false
  return !day.offSlots.includes(slotHora)
}

export function resumoSemana(schedule: DaySchedule[]): string {
  const abertos = schedule.filter((d) => d.enabled)
  if (abertos.length === 0) return 'Fechado — consulte o WhatsApp'
  if (abertos.length === 6 && schedule[0].enabled === false)
    return '10h às 19h (segunda a sábado)'
  return abertos.map((d) => d.short.toLowerCase()).join(' • ')
}

export function proximoSlotLivre(
  schedule: DaySchedule[],
  now = new Date(),
  overrides: DateOverride[] = [],
): { label: string; slot: TimeSlot } | null {
  for (let i = 0; i < 14; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const livres = slotsLivresParaData(schedule, overrides, d).filter((s) => {
      if (i !== 0) return true
      const [h, m] = s.split(':').map(Number)
      return h * 60 + m > now.getHours() * 60 + now.getMinutes()
    })
    if (livres.length > 0) {
      const label = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
      return { label, slot: livres[0] }
    }
  }
  return null
}
