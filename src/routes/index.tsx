import { createFileRoute, Link } from '@tanstack/react-router'
import {
  CTABand,
  GhostButton,
  Marquee,
  SectionHead,
  WhatsAppButton,
} from '../components/layout'
import { StatusBadge, useHorarios } from '../components/horarios'
import { proximoSlotLivre, resumoSemana } from '../data/horarios'
import {
  PRODUCTS,
  SERVICES,
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
    <div>
      {/* HERO fotográfico full-bleed */}
      <section className="relative overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Salão da barbearia L MARTINS"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-coal)] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
                Barbearia • {resumoSemana(schedule)}
              </p>
              <StatusBadge schedule={schedule} overrides={overrides} />
            </div>
            <h1 className="font-display mt-4 text-6xl md:text-8xl leading-[0.92]">
              L MARTINS
              <br />
              <span className="gold-text">CORTE & BARBA</span>
            </h1>
            <p className="mt-4 max-w-md text-white/75">
              Navalha, tesoura e toalha quente. Agende o horário e peça produtos
              direto no WhatsApp — sem cadastro, sem complicação.
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
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
              <span className="rounded-full border border-[var(--color-brass)]/40 px-3 py-1.5 text-[var(--color-brass)]">
                ✂ Corte R$ 60
              </span>
              <span className="rounded-full border border-[var(--color-brass)]/40 px-3 py-1.5 text-[var(--color-brass)]">
                🪒 Barba R$ 55
              </span>
              <span className="rounded-full bg-[var(--color-brass)] px-3 py-1.5 font-bold text-black">
                🔥 Combo R$ 95
              </span>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      <div className="mx-auto max-w-6xl px-4">
        {/* SERVIÇOS DESTAQUE */}
        <section className="py-10">
          <SectionHead
            kicker="Os mais pedidos"
            title="DESTAQUES"
            link={{ to: '/servicos', label: 'Ver cardápio completo' }}
          />
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {destaques.map((s, i) => (
              <div key={s.id} className="glass relative overflow-hidden rounded-2xl p-5">
                <span className="font-display pointer-events-none absolute -top-2 right-2 text-6xl text-[var(--color-brass)]/15">
                  0{i + 1}
                </span>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-brass)]">
                  {s.categoria} • {s.duracao}
                </p>
                <h3 className="font-display mt-2 text-xl">{s.nome}</h3>
                <p className="mt-1 text-sm text-white/60">{s.desc}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-display text-2xl gold-text">{formatBRL(s.preco)}</span>
                  <WhatsAppButton href={waAgendarServico(s)} label="Agendar" small />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUTOS */}
        <section className="py-10">
          <SectionHead
            kicker="Leve a barbearia pra casa"
            title="PRODUTOS"
            link={{ to: '/produtos', label: 'Ver todos' }}
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="glass zoom-img overflow-hidden rounded-2xl">
                <div className="relative">
                  <img src={p.img} alt={p.nome} className="h-44 w-full object-cover" loading="lazy" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-brass)] backdrop-blur">
                    {p.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{p.nome}</h3>
                  <p className="mt-0.5 text-xs text-white/50">{p.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-xl gold-text">{formatBRL(p.preco)}</span>
                    <a
                      href={waPedirProduto(p)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-[var(--color-wa)] px-4 py-1.5 text-xs font-bold text-black hover:brightness-110"
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
        <section className="py-10">
          <SectionHead
            kicker="Feitos na cadeira"
            title="TRABALHOS"
            link={{ to: '/galeria', label: 'Ver galeria' }}
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {WORKS.map((w) => (
              <div key={w.id} className="glass zoom-img group overflow-hidden rounded-2xl">
                <div className="relative">
                  <img src={w.img} alt={w.titulo} className="h-64 w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-display text-lg leading-tight">{w.titulo}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-brass)]">
                      {w.tag}
                    </p>
                  </div>
                </div>
                <a
                  href={waQueroEsseCorte(w)}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-[var(--color-wa)]/10 px-4 py-2.5 text-center font-mono text-xs font-bold text-[var(--color-wa)] transition group-hover:bg-[var(--color-wa)] group-hover:text-black"
                >
                  QUERO ESSE CORTE →
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CTABand />
    </div>
  )
}
