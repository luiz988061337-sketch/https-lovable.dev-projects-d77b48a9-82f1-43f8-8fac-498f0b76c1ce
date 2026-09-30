import { createFileRoute } from '@tanstack/react-router'
import { CTABand, SectionHead, WhatsAppButton } from '../components/layout'
import { SERVICES, formatBRL, waAgendarServico } from '../data/barbearia'

export const Route = createFileRoute('/servicos')({
  head: () => ({
    meta: [
      { title: 'Cardápio de Serviços — L MARTINS Barbearia' },
      {
        name: 'description',
        content: 'Cortes, barba, coloração, tratamentos e pacotes. Preços de exemplo e agendamento pelo WhatsApp.',
      },
      { property: 'og:title', content: 'Serviços L MARTINS' },
    ],
  }),
  component: Servicos,
})

const CATS = ['Cortes', 'Barba', 'Coloração', 'Tratamentos', 'Pacotes'] as const

function Servicos() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SectionHead kicker="Cardápio • preços base" title="SERVIÇOS" />
      <p className="mt-3 max-w-xl text-white/70">
        Valores do protótipo como base inicial — fáceis de trocar pelos reais depois.
        Todo agendamento é pelo WhatsApp, com mensagem pronta por serviço.
      </p>

      <div className="sticky top-24 z-30 mt-5 flex gap-2 overflow-x-auto pb-2 md:top-16">
        {CATS.map((cat) => (
          <a
            key={cat}
            href={`#cat-${cat}`}
            className="glass-strong whitespace-nowrap rounded-full px-4 py-1.5 font-mono text-xs text-[var(--color-brass)] hover:bg-[var(--color-brass)] hover:text-black"
          >
            {cat}
          </a>
        ))}
      </div>

      {CATS.map((cat) => {
        const itens = SERVICES.filter((s) => s.categoria === cat)
        return (
          <section key={cat} id={`cat-${cat}`} className="mt-10 scroll-mt-32">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl gold-text">{cat.toUpperCase()}</h2>
              <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-white/50">
                {itens.length} itens
              </span>
            </div>
            <div className="rule-gold mt-2 w-24" />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {itens.map((s) => (
                <div key={s.id} className="glass rounded-2xl p-5 flex justify-between gap-4 transition hover:border-[var(--color-brass)]/50">
                  <div>
                    <h3 className="font-display text-lg">{s.nome}</h3>
                    <p className="text-sm text-white/60">{s.desc}</p>
                    <p className="mt-2 inline-block rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-white/50">
                      ⏱ {s.duracao}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <span className="font-display text-2xl gold-text">{formatBRL(s.preco)}</span>
                    <WhatsAppButton href={waAgendarServico(s)} label="Agendar" small />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      <CTABand />
    </div>
  )
}
