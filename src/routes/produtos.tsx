import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CTABand, SectionHead } from '../components/layout'
import { useCart, useCatalog } from '../components/loja'
import { cartTotal } from '../data/loja'
import { formatBRL } from '../data/barbearia'

export const Route = createFileRoute('/produtos')({
  head: () => ({
    meta: [
      { title: 'Produtos — L MARTINS Barbearia' },
      {
        name: 'description',
        content: 'Cosméticos com entrega em até 2 dias úteis. Pagamento no Pix, só sai para entrega se pago.',
      },
      { property: 'og:title', content: 'Produtos L MARTINS' },
    ],
  }),
  component: Produtos,
})

function Produtos() {
  const { catalog } = useCatalog()
  const { cart, add, count } = useCart()
  const tags = ['Todos', ...Array.from(new Set(catalog.map((p) => p.tag)))]
  const [filtro, setFiltro] = useState('Todos')
  const lista = filtro === 'Todos' ? catalog : catalog.filter((p) => p.tag === filtro)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SectionHead kicker="Cosméticos • entrega em até 2 dias úteis" title="PRODUTOS" />
      <p className="mt-3 max-w-xl text-white/70">
        Monte a sacola e finalize o pedido — pagamento no Pix e a entrega só sai após confirmado.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
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
        <Link
          to="/pedido"
          className="ml-auto rounded-full bg-[var(--color-wa)] px-5 py-2 text-sm font-bold text-black"
        >
          Sacola ({count}) • {formatBRL(cartTotal(cart))}
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {lista.map((p) => (
          <div key={p.id} className="glass zoom-img overflow-hidden rounded-2xl flex flex-col">
            <div className="relative">
              <img src={p.img} alt={p.nome} className="h-52 w-full object-cover" loading="lazy" />
              <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-brass)] backdrop-blur">
                {p.tag}
              </span>
              <span className="font-display absolute bottom-3 right-3 rounded-xl bg-[var(--color-brass)] px-3 py-1 text-lg text-black">
                {formatBRL(p.preco)}
              </span>
            </div>
            <div className="p-5 flex flex-1 flex-col">
              <h3 className="font-display mt-1 text-xl">{p.nome}</h3>
              <p className="mt-1 text-sm text-white/60 flex-1">{p.desc}</p>
              <button
                onClick={() => add(p)}
                className="mt-4 inline-flex items-center justify-center rounded-full border border-[var(--color-wa)]/60 px-4 py-2.5 text-sm font-bold text-[var(--color-wa)] hover:bg-[var(--color-wa)] hover:text-black"
              >
                + Adicionar à sacola
              </button>
            </div>
          </div>
        ))}
      </div>
      {lista.length === 0 && (
        <p className="mt-8 text-center font-mono text-sm text-white/40">
          Catálogo vazio por aqui — o dono pode ativar itens em /admin/catalogo.
        </p>
      )}

      <CTABand />
    </div>
  )
}
