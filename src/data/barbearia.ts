export const WHATSAPP_NUMBER = '5515988216391'
export const WHATSAPP_DISPLAY = '(15) 98821-6391'
export const ADDRESS = 'R. Jaime Lopes da Silva, 49'
export const HOURS = '10h às 19h (segunda a sábado)'
export const MAPS_QUERY = encodeURIComponent('R. Jaime Lopes da Silva, 49')
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const WA_AGENDAR_GERAL = waLink(
  'Olá, L MARTINS! Quero agendar um horário. Pode me passar os horários livres?',
)

export type Service = {
  id: string
  nome: string
  desc: string
  preco: number
  duracao: string
  categoria: 'Cortes' | 'Barba' | 'Coloração' | 'Tratamentos' | 'Pacotes'
}

export const SERVICES: Service[] = [
  { id: 'corte-degrade', nome: 'Corte Degradê', desc: 'Fade navalhado, acabamento e finalização', preco: 60, duracao: '40min', categoria: 'Cortes' },
  { id: 'corte-tesoura', nome: 'Corte Tesoura', desc: 'Clássico ou social, com lavagem', preco: 60, duracao: '40min', categoria: 'Cortes' },
  { id: 'corte-infantil', nome: 'Corte Infantil', desc: 'Paciência e estilo para os pequenos', preco: 55, duracao: '35min', categoria: 'Cortes' },
  { id: 'barba-navalha', nome: 'Barba Navalha', desc: 'Toalha quente, navalha e hidratação', preco: 55, duracao: '30min', categoria: 'Barba' },
  { id: 'barba-desenhada', nome: 'Barba + Desenho', desc: 'Contorno marcado e acabamento a seco', preco: 65, duracao: '35min', categoria: 'Barba' },
  { id: 'corte-barba', nome: 'Corte + Barba', desc: 'Combo completo, o mais pedido', preco: 95, duracao: '1h10', categoria: 'Pacotes' },
  { id: 'coloracao', nome: 'Coloração / Platinado', desc: 'Luzes, platinado ou tonalizante', preco: 120, duracao: '1h30', categoria: 'Coloração' },
  { id: 'pigmentacao', nome: 'Pigmentação Barba', desc: 'Preenchimento e contorno definido', preco: 45, duracao: '25min', categoria: 'Coloração' },
  { id: 'hidratacao', nome: 'Hidratação Capilar', desc: 'Tratamento profundo com massagem', preco: 50, duracao: '30min', categoria: 'Tratamentos' },
  { id: 'limpeza-pele', nome: 'Limpeza + Esfoliação', desc: 'Rosto renovado pós-barba', preco: 40, duracao: '25min', categoria: 'Tratamentos' },
  { id: 'pacote-mensal', nome: 'Pacote Mensal', desc: '4 cortes + 2 barbas no mês', preco: 180, duracao: 'mês', categoria: 'Pacotes' },
  { id: 'pacote-noivo', nome: 'Dia do Noivo', desc: 'Corte + barba + massagem + brinde', preco: 180, duracao: '2h', categoria: 'Pacotes' },
]

export function waAgendarServico(s: Service) {
  return waLink(`Olá, L MARTINS! Quero agendar: ${s.nome} — R$ ${s.preco}. Quais horários livres?`)
}

export type Product = {
  id: string
  nome: string
  desc: string
  preco: number
  tag: string
  img: string
}

export const PRODUCTS: Product[] = [
  { id: 'pomada-fosca', nome: 'Pomada Fosca', desc: 'Efeito seco, alta fixação 80g', preco: 45, tag: 'Cabelo', img: '/images/produto-pomada.svg' },
  { id: 'oleo-barba', nome: 'Óleo de Barba', desc: 'Cedro + alecrim, 30ml', preco: 39, tag: 'Barba', img: '/images/produto-oleo.svg' },
  { id: 'creme-pos', nome: 'Creme Pós-Barba', desc: 'Alivia irritação, menta fresca', preco: 35, tag: 'Barba', img: '/images/produto-creme.svg' },
  { id: 'kit-lmartins', nome: 'Kit L MARTINS', desc: 'Pomada + óleo + pente de madeira', preco: 99, tag: 'Kits presente', img: '/images/produto-kit.svg' },
]

export function waPedirProduto(p: Product) {
  return waLink(`Olá, L MARTINS! Quero pedir: ${p.nome} — R$ ${p.preco}. Ainda tem disponível?`)
}

export type Work = {
  id: string
  titulo: string
  tag: string
  img: string
}

export const WORKS: Work[] = [
  { id: 'fade-navalhado', titulo: 'Fade Navalhado', tag: 'Degradê', img: '/images/corte-fade.svg' },
  { id: 'barba-toalha', titulo: 'Barba Toalha Quente', tag: 'Barba', img: '/images/corte-barba.svg' },
  { id: 'social-tesoura', titulo: 'Social Tesoura', tag: 'Clássico', img: '/images/corte-social.svg' },
  { id: 'desenho-freestyle', titulo: 'Freestyle + Pigmentação', tag: 'Desenho', img: '/images/corte-freestyle.svg' },
]

export function waQueroEsseCorte(w: Work) {
  return waLink(`Olá, L MARTINS! Vi na galeria e quero esse corte: ${w.titulo}. Quando posso agendar?`)
}

export function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}
