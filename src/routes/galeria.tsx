import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CTABand, SectionHead } from '../components/layout'
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
  const tags = ['Todos', ...Array.from(new Set(WORKS.map((w) => w.tag)))]
  const [filtro, setFiltro] = useState('Todos')
  const lista = filtro === 'Todos' ? WORKS : WORKS.filter((w) => w.tag === filtro)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SectionHead kicker="Portfólio • trabalhos reais" title="GALERIA" />
      <p className="mt-3 max-w-xl text-white/70">
        Toque em “Quero esse corte” e a mensagem já vai pronta no WhatsApp com o nome do estilo.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setFiltro(t)}
            className={`rounded-full px-4 py-1.5 font-mono text-xs transition ${
              filtro === t
                ? 'bg-[var(--color-brass)] font-bold text-black'
                : 'border border-white/15 text-white/70 hover:border-[var(--color-brass)]/60'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {lista.map((w) => (
          <div key={w.id} className="glass zoom-img group overflow-hidden rounded-2xl">
            <div className="relative">
              <img src={w.img} alt={w.titulo} className="h-80 w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-brass)] backdrop-blur">
                {w.tag}
              </span>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-display text-2xl leading-tight">{w.titulo}</h3>
              </div>
            </div>
            <a
              href={waQueroEsseCorte(w)}
              target="_blank"
              rel="noreferrer"
              className="block bg-[var(--color-wa)]/10 px-4 py-3 text-center font-mono text-xs font-bold text-[var(--color-wa)] transition group-hover:bg-[var(--color-wa)] group-hover:text-black"
            >
              QUERO ESSE CORTE →
            </a>
          </div>
        ))}
      </div>

      <CTABand />
    </div>
  )
}
