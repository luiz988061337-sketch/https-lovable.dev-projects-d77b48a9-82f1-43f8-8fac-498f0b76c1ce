import { createFileRoute } from '@tanstack/react-router'
import { WhatsAppButton } from '../components/layout'
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
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
        Cardápio • preços base
      </p>
      <h1 className="font-display mt-2 text-4xl md:text-6xl">SERVIÇOS</h1>
      <p className="mt-3 max-w-xl text-white/70">
        Valores do protótipo como base inicial — fáceis de trocar pelos reais depois.
        Todo agendamento é pelo WhatsApp, com mensagem pronta por serviço.
      </p>

      {CATS.map((cat) => (
        <section key={cat} className="mt-10">
          <h2 className="font-display text-2xl text-[var(--color-brass)]">{cat.toUpperCase()}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {SERVICES.filter((s) => s.categoria === cat).map((s) => (
              <div key={s.id} className="glass rounded-2xl p-5 flex justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg">{s.nome}</h3>
                  <p className="text-sm text-white/60">{s.desc}</p>
                  <p className="mt-2 font-mono text-[11px] text-white/50">{s.duracao}</p>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <span className="font-display text-2xl">{formatBRL(s.preco)}</span>
                  <WhatsAppButton href={waAgendarServico(s)} label="Agendar" small />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
