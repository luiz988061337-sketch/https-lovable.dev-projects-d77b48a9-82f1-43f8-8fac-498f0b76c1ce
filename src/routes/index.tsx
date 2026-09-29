import { createFileRoute, Link } from '@tanstack/react-router'
import { GhostButton, WhatsAppButton } from '../components/layout'
import { StatusBadge, useHorarios } from '../components/horarios'
import { proximoSlotLivre, resumoSemana } from '../data/horarios'
import {
  PRODUCTS,
  SERVICES,
  WA_AGENDAR_GERAL,
  WORKS,
  formatBRL,
  waAgendarServico,
  waPedirProduto,
  waQueroEsseCorte,
} from '../data/barbearia'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'L MARTINS Barbearia — Início' },
      {
        name: 'description',
        content: 'Corte degradê, barba na navalha e produtos. Agende pelo WhatsApp: (15) 98821-6391.',
      },
    ],
  }),
  component: Home,
})

function Home() {
  const destaques = SERVICES.slice(0, 3)
  const { schedule, overrides } = useHorarios()
  const prox = proximoSlotLivre(schedule, new Date(), overrides)
  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* HERO */}
      <section className="grid gap-8 md:grid-cols-2 items-center py-8 md:py-14">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
              Barbearia • {resumoSemana(schedule)}
            </p>
          </div>
          <div className="mt-2">
            <StatusBadge schedule={schedule} overrides={overrides} />
          </div>
          <h1 className="font-display mt-3 text-5xl md:text-7xl leading-[0.95]">
            L MARTINS
            <br />
            <span className="text-[var(--color-brass)]">CORTE & BARBA</span>
          </h1>
          <p className="mt-4 max-w-md text-white/70">
            Vitrine de serviços, galeria de trabalhos e produtos com pedido direto no WhatsApp.
            Sem cadastro, sem carrinho complicado.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/agendar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-wa)] px-6 py-3 text-base font-bold text-black hover:brightness-110"
            >
              ◉ Agendar dia e hora
            </Link>
            <GhostButton to="/servicos" label="Ver cardápio" />
          </div>
          {prox && (
            <p className="mt-3 font-mono text-xs text-[var(--color-wa)]">
              Próximo livre: {prox.label} às {prox.slot} →
            </p>
          )}
          <div className="mt-6 flex gap-6 font-mono text-xs text-white/50">
            <span>✂ Corte R$ 60</span>
            <span>🪒 Barba R$ 55</span>
            <span>🔥 Combo R$ 95</span>
          </div>
        </div>
        <div className="glass overflow-hidden rounded-2xl">
          <img
            src="/images/hero.svg"
            alt="Cadeira de barbearia L MARTINS com luz quente"
            className="h-72 w-full object-cover md:h-96"
            loading="eager"
          />
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="font-display text-lg">NAVALHA • TESOURA • ESTILO</p>
              <p className="font-mono text-[11px] text-white/50">R. Jaime Lopes da Silva, 49</p>
            </div>
            <StatusBadge schedule={schedule} overrides={overrides} />
          </div>
        </div>
      </section>

      {/* SERVIÇOS DESTAQUE */}
      <section className="py-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">DESTAQUES</h2>
          <a href="/servicos" className="font-mono text-xs text-[var(--color-brass)] hover:underline">
            Ver cardápio completo →
          </a>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {destaques.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-brass)]">
                {s.categoria} • {s.duracao}
              </p>
              <h3 className="font-display mt-2 text-xl">{s.nome}</h3>
              <p className="mt-1 text-sm text-white/60">{s.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-2xl">{formatBRL(s.preco)}</span>
                <WhatsAppButton href={waAgendarServico(s)} label="Agendar" small />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUTOS */}
      <section className="py-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">PRODUTOS</h2>
          <a href="/produtos" className="font-mono text-xs text-[var(--color-brass)] hover:underline">
            Ver todos →
          </a>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="glass overflow-hidden rounded-2xl">
              <img src={p.img} alt={p.nome} className="h-40 w-full object-cover" loading="lazy" />
              <div className="p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-brass)]">
                  {p.tag}
                </p>
                <h3 className="font-semibold">{p.nome}</h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-lg">{formatBRL(p.preco)}</span>
                  <a
                    href={waPedirProduto(p)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[var(--color-wa)] px-3 py-1.5 text-xs font-bold text-black"
                  >
                    Pedir
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      <section className="py-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl">TRABALHOS</h2>
          <a href="/galeria" className="font-mono text-xs text-[var(--color-brass)] hover:underline">
            Ver galeria →
          </a>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {WORKS.map((w) => (
            <div key={w.id} className="glass overflow-hidden rounded-2xl">
              <img src={w.img} alt={w.titulo} className="h-56 w-full object-cover" loading="lazy" />
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{w.titulo}</p>
                  <p className="font-mono text-[10px] text-white/50">{w.tag}</p>
                </div>
                <a
                  href={waQueroEsseCorte(w)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[11px] text-[var(--color-wa)] hover:underline"
                >
                  Quero esse →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
