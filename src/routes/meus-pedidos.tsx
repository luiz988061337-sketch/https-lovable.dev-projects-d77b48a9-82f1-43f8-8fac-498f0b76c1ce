import { createFileRoute, Link } from '@tanstack/react-router'
import { SectionHead } from '../components/layout'
import { useOrders } from '../components/loja'
import { formatBRL } from '../data/barbearia'
import { STATUS_LABEL, formatDataBR } from '../data/loja'

export const Route = createFileRoute('/meus-pedidos')({
  head: () => ({
    meta: [{ title: 'Meus pedidos — L MARTINS' }],
  }),
  component: MeusPedidos,
})

function MeusPedidos() {
  const { orders, ready } = useOrders()
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <SectionHead kicker="Acompanhe por aqui" title="MEUS PEDIDOS" />
      {!ready ? (
        <p className="mt-6 font-mono text-sm text-white/50">Carregando…</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-white/60">
          Nenhum pedido ainda — <Link to="/produtos" className="text-[var(--color-brass)] underline">ver cosméticos</Link>.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {orders.map((o) => (
            <div key={o.id} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs text-white/50">{o.id}</p>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold ${
                    o.status === 'pago' || o.status === 'em_entrega' || o.status === 'entregue'
                      ? 'bg-[var(--color-wa)] text-black'
                      : 'bg-[var(--color-brass)]/20 text-[var(--color-brass)]'
                  }`}
                >
                  {STATUS_LABEL[o.status]}
                </span>
              </div>
              <div className="mt-2 text-sm text-white/70">
                {o.itens.map((i) => (
                  <p key={i.id}>• {i.qtd}x {i.nome}</p>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-3 text-sm">
                <span>Total <b className="font-display text-lg">{formatBRL(o.total)}</b> • Pix</span>
                <span className="font-mono text-xs text-white/60">Entrega até {formatDataBR(o.previsaoEntrega)}</span>
              </div>
              {o.status === 'aguardando_pagamento' && (
                <p className="mt-2 font-mono text-[11px] text-[var(--color-brass)]">
                  Envie o comprovante do Pix no WhatsApp para liberar a entrega.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
