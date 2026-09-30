// Lojinha de cosméticos — sem backend (localStorage neste navegador).
// Regras: entrega em até PRAZO_DIAS dias úteis; venda só sai para entrega se status === 'pago'.

export type CatalogProduct = {
  id: string
  nome: string
  desc: string
  preco: number
  tag: string
  img: string
  ativo: boolean
}

export const DEFAULT_CATALOG: CatalogProduct[] = [
  { id: 'pomada-fosca', nome: 'Pomada Fosca', desc: 'Efeito seco, alta fixação 80g', preco: 45, tag: 'Cabelo', img: '/images/produto-pomada.jpg', ativo: true },
  { id: 'oleo-barba', nome: 'Óleo de Barba', desc: 'Cedro + alecrim, 30ml', preco: 39, tag: 'Barba', img: '/images/produto-oleo.jpg', ativo: true },
  { id: 'creme-pos', nome: 'Creme Pós-Barba', desc: 'Alivia irritação, menta fresca', preco: 35, tag: 'Barba', img: '/images/produto-creme.jpg', ativo: true },
  { id: 'kit-lmartins', nome: 'Kit L MARTINS', desc: 'Pomada + óleo + pente de madeira', preco: 99, tag: 'Kits presente', img: '/images/produto-kit.jpg', ativo: true },
]

export type OrderStatus = 'aguardando_pagamento' | 'pago' | 'em_entrega' | 'entregue'

export const STATUS_LABEL: Record<OrderStatus, string> = {
  aguardando_pagamento: 'Aguardando pagamento',
  pago: 'Pago',
  em_entrega: 'Em entrega',
  entregue: 'Entregue',
}

export type OrderItem = { id: string; nome: string; preco: number; qtd: number }
export type CartItem = OrderItem

export type Order = {
  id: string
  criadoEm: string // ISO
  itens: OrderItem[]
  total: number
  nome: string
  endereco: string
  pagamento: 'Pix'
  status: OrderStatus
  previsaoEntrega: string // YYYY-MM-DD (até 2 dias úteis)
}

export type LojaConfig = { pixKey: string; prazoDias: number }
export const DEFAULT_CONFIG: LojaConfig = { pixKey: '', prazoDias: 2 }

const K = {
  catalogo: 'lmartins-catalogo-v1',
  sacola: 'lmartins-sacola-v1',
  pedidos: 'lmartins-pedidos-v1',
  config: 'lmartins-loja-config-v1',
}

function read<T>(key: string, fb: T): T {
  if (typeof window === 'undefined') return fb
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fb
  } catch {
    return fb
  }
}
function write(key: string, v: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(v))
  } catch {
    /* ignora */
  }
}

export const loadCatalog = (): CatalogProduct[] => read(K.catalogo, DEFAULT_CATALOG)
export const saveCatalog = (c: CatalogProduct[]) => write(K.catalogo, c)
export const loadCart = (): CartItem[] => read(K.sacola, [])
export const saveCart = (c: CartItem[]) => write(K.sacola, c)
export const loadOrders = (): Order[] => read(K.pedidos, [])
export const saveOrders = (o: Order[]) => write(K.pedidos, o)
export const loadConfig = (): LojaConfig => ({ ...DEFAULT_CONFIG, ...read(K.config, {}) })
export const saveConfig = (c: LojaConfig) => write(K.config, c)

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 999)}`
}

export function cartTotal(cart: CartItem[]) {
  return cart.reduce((t, i) => t + i.preco * i.qtd, 0)
}

/** Soma dias úteis (pula sábado/domingo). */
export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from)
  let n = 0
  while (n < days) {
    d.setDate(d.getDate() + 1)
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) n++
  }
  return d
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function formatDataBR(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

/** Só pode sair para entrega se estiver pago. */
export function podeLiberarEntrega(o: Order): boolean {
  return o.status === 'pago'
}

export function proximoStatus(o: Order): OrderStatus | null {
  if (o.status === 'aguardando_pagamento') return 'pago'
  if (o.status === 'pago') return 'em_entrega'
  if (o.status === 'em_entrega') return 'entregue'
  return null
}
