import { createFileRoute } from '@tanstack/react-router'
import { useOrders } from '../../components/loja'
import { formatBRL } from '../../data/barbearia'
import { STATUS_LABEL, formatDataBR, podeLiberarEntrega, proximoStatus } from '../../data/loja'

export const Route = createFileRoute('/admin/pedidos')({
  head: () => ({
    meta: [
      { title: 'Pedidos para entrega — L MARTINS (dono)' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: AdminPedidos,
})

const AHEAD: Record<string, string> = {
  aguardando_pagamento: 'Confirmar pagamento (Pix recebido)',
  pago: 'Liberar para entrega (produto pago ✓)',
  em_entrega: 'Marcar como entregue',
}

function AdminPedidos() {
  const { orders, update, ready } = useOrders()
  const pendentes = orders.filter((o) => o.status !== 'entregue').length
  const aEntregar = orders.filter((o) => o.status === 'pago').length

  function avancar(id: string) {
    update(
      orders.map((o) => {
        if (o.id !== id) return o
        // trava: só libera entrega se pago
        if (o.status === 'pago' && !podeLiberarEntrega(o)) return o
        const next = proximoStatus(o)
        return next ? { ...o, status: next } : o
      }),
    )
  }

  if (!ready) return <p className="mx-auto max-w-6xl px-4 py-8">Carregando…</p>

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
        Área do dono • entrega em até 2 dias úteis
      </p>
      <h1 className="font-display mt-2 text-4xl md:text-5xl">PEDIDOS P/ ENTREGA</h1>

      <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
        <span className="rounded-full bg-white/5 px-4 py-2">Pendentes: <b>{pendentes}</b></span>
        <span className="rounded-full bg-[var(--color-wa)]/15 text-[var(--color-wa)] px-4 py-2">
          Pagos p/ liberar: <b>{aEntregar}</b>
        </span>
      </div>
      <p className="mt-3 max-w-2xl rounded-xl border border-[var(--color-brass)]/40 bg-[var(--color-brass)]/5 p-3 font-mono text-[11px] text-[var(--color-brass)]">
        Regra: a entrega só libera com o produto pago. O botão trava sozinho enquanto aguardar pagamento.
      </p>

      {orders.length === 0 ? (
        <p className="mt-6 text-white/60">Nenhum pedido ainda. Pedidos feitos neste navegador aparecem aqui.</p>
      ) : (
        <div className="mt-4 grid gap-3">
          {orders.map((o) => {
            const next = proximoStatus(o)
            const bloqueado = o.status === 'pago' && !podeLiberarEntrega(o)
            return (
              <div key={o.id} className="glass rounded-2xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs text-white/50">
                    {o.id} • {o.nome} • {o.endereco}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold ${
                      o.status === 'aguardando_pagamento'
                        ? 'bg-[var(--color-brass)]/20 text-[var(--color-brass)]'
                        : 'bg-[var(--color-wa)] text-black'
                    }`}
                  >
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>
                <div className="mt-2 text-sm text-white/70">
                  {o.itens.map((i) => (
                    <p key={i.id}>• {i.qtd}x {i.nome} — {formatBRL(i.preco * i.qtd)}</p>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <span className="text-sm">
                    Total <b className="font-display text-xl">{formatBRL(o.total)}</b> • Pix • entrega até {formatDataBR(o.previsaoEntrega)}
                  </span>
                  {next && (
                    <button
                      onClick={() => avancar(o.id)}
                      disabled={!!bloqueado}
                      className="rounded-full bg-[var(--color-wa)] px-4 py-2 text-sm font-bold text-black disabled:opacity-40"
                      title={o.status === 'aguardando_pagamento' ? 'Só libera após confirmar o Pix' : ''}
                    >
                      {AHEAD[o.status] ?? 'Avançar'}
                    </button>
                  )}
                </div>
                {o.status === 'aguardando_pagamento' && (
                  <p className="mt-2 font-mono text-[11px] text-white/40">
                    Aguardando comprovante do Pix no WhatsApp — entrega bloqueada.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
