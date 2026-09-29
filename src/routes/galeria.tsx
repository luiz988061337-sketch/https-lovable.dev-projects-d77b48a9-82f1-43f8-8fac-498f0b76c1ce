import { createFileRoute } from '@tanstack/react-router'
import { WORKS, waQueroEsseCorte } from '../data/barbearia'

export const Route = createFileRoute('/galeria')({
  head: () => ({
    meta: [
      { title: 'Galeria — L MARTINS Barbearia' },
      {
        name: 'description',
        content: 'Portfólio de cortes e barbas da L MARTINS. Gostou? Toque em Quero esse corte e agende.',
      },
      { property: 'og:title', content: 'Galeria L MARTINS' },
    ],
  }),
  component: Galeria,
})

function Galeria() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
        Portfólio • trabalhos reais
      </p>
      <h1 className="font-display mt-2 text-4xl md:text-6xl">GALERIA</h1>
      <p className="mt-3 max-w-xl text-white/70">
        Toque em “Quero esse corte” e a mensagem já vai pronta no WhatsApp com o nome do estilo.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WORKS.map((w) => (
          <div key={w.id} className="glass overflow-hidden rounded-2xl">
            <img src={w.img} alt={w.titulo} className="h-72 w-full object-cover" loading="lazy" />
            <div className="p-4">
              <h3 className="font-display text-lg">{w.titulo}</h3>
              <p className="font-mono text-[11px] text-white/50">{w.tag}</p>
              <a
                href={waQueroEsseCorte(w)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-wa)] px-4 py-2 text-sm font-bold text-black hover:brightness-110"
              >
                Quero esse corte
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
