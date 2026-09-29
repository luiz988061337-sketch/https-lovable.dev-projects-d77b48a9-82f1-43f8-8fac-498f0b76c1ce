import { createFileRoute } from '@tanstack/react-router'
import { PRODUCTS, formatBRL, waPedirProduto } from '../data/barbearia'

export const Route = createFileRoute('/produtos')({
  head: () => ({
    meta: [
      { title: 'Produtos — L MARTINS Barbearia' },
      {
        name: 'description',
        content: 'Pomada, óleo de barba, creme e kits. Peça pelo WhatsApp sem loja online.',
      },
      { property: 'og:title', content: 'Produtos L MARTINS' },
    ],
  }),
  component: Produtos,
})

function Produtos() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
        Catálogo • pedido no WhatsApp
      </p>
      <h1 className="font-display mt-2 text-4xl md:text-6xl">PRODUTOS</h1>
      <p className="mt-3 max-w-xl text-white/70">
        Escolha o produto e toque em “Pedir no WhatsApp” — a mensagem já vai pronta com nome e preço.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="glass overflow-hidden rounded-2xl flex flex-col">
            <img src={p.img} alt={p.nome} className="h-52 w-full object-cover" loading="lazy" />
            <div className="p-5 flex flex-1 flex-col">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-brass)]">
                {p.tag}
              </p>
              <h3 className="font-display mt-1 text-xl">{p.nome}</h3>
              <p className="mt-1 text-sm text-white/60 flex-1">{p.desc}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-2xl">{formatBRL(p.preco)}</span>
              </div>
              <a
                href={waPedirProduto(p)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center justify-center rounded-full bg-[var(--color-wa)] px-4 py-2.5 text-sm font-bold text-black hover:brightness-110"
              >
                Pedir no WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
