import { useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SectionHead } from '../components/layout'
import { useCart, useLojaConfig, useOrders } from '../components/loja'
import { waLink } from '../data/barbearia'
import { formatBRL } from '../data/barbearia'
import {
  addBusinessDays,
  cartTotal,
  formatDataBR,
  newId,
  toISODate,
  type Order,
} from '../data/loja'

export const Route = createFileRoute('/pedido')({
  head: () => ({
    meta: [{ title: 'Finalizar pedido — L MARTINS' }],
  }),
  component: Pedido,
})

function Pedido() {
  const { cart, setQtd, clear } = useCart()
  const { orders, update } = useOrders()
  const { config } = useLojaConfig()
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const nav = useNavigate()

  const total = cartTotal(cart)
  const previsao = useMemo(
    () => toISODate(addBusinessDays(new Date(), config.prazoDias)),
    [config.prazoDias],
  )

  function finalizar() {
    if (cart.length === 0 || !nome.trim() || !endereco.trim()) return
    const order: Order = {
      id: newId('ped'),
      criadoEm: new Date().toISOString(),
      itens: cart,
      total,
      nome: nome.trim(),
      endereco: endereco.trim(),
      pagamento: 'Pix',
      status: 'aguardando_pagamento',
      previsaoEntrega: previsao,
    }
    update([order, ...orders])
    const linhas = cart.map((i) => `• ${i.qtd}x ${i.nome} — R$ ${i.preco * i.qtd}`).join('\n')
    const msg =
      `Olá, L MARTINS! Novo pedido ${order.id}:\n${linhas}\n` +
      `Total: R$ ${total}\nNome: ${order.nome}\nEntrega: ${order.endereco}\n` +
      `Pagamento: Pix (vou enviar o comprovante)\nEntrega em até ${config.prazoDias} dias úteis (até ${formatDataBR(previsao)})`
    clear()
    window.open(waLink(msg), '_blank')
    nav({ to: '/meus-pedidos' })
  }

  const valido = cart.length > 0 && nome.trim() !== '' && endereco.trim() !== ''

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <SectionHead kicker="Sacola • entrega em até 2 dias úteis" title="SEU PEDIDO" />

      {cart.length === 0 ? (
        <p className="mt-6 text-white/60">
          Sacola vazia — escolha cosméticos em <a href="/produtos" className="text-[var(--color-brass)] underline">Produtos</a>.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          <div className="glass rounded-2xl p-5">
            {cart.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-3 border-b border-white/5 py-3 last:border-0">
                <div>
                  <p className="font-semibold">{i.nome}</p>
                  <p className="font-mono text-xs text-white/50">{formatBRL(i.preco)} cada</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQtd(i.id, i.qtd - 1)} className="rounded-full border border-white/15 w-8 h-8">−</button>
                  <span className="font-mono w-6 text-center">{i.qtd}</span>
                  <button onClick={() => setQtd(i.id, i.qtd + 1)} className="rounded-full border border-white/15 w-8 h-8">+</button>
                </div>
              </div>
            ))}
            <p className="font-display mt-3 text-right text-2xl gold-text">Total {formatBRL(total)}</p>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-xl">ENTREGA</h2>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="mt-3 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 text-sm"
            />
            <input
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Endereço de entrega"
              className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 text-sm"
            />
            <p className="mt-2 font-mono text-[11px] text-white/50">
              Prazo: até {config.prazoDias} dias úteis (até {formatDataBR(previsao)})
            </p>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-xl">PAGAMENTO • PIX</h2>
            <p className="mt-2 text-sm text-white/70">
              {config.pixKey
                ? <>Chave Pix do lojista: <b className="font-mono">{config.pixKey}</b></>
                : 'Chave Pix a confirmar no WhatsApp.'}{' '}
              Faça o Pix de <b>{formatBRL(total)}</b> e envie o comprovante no WhatsApp.
            </p>
            <p className="mt-2 rounded-xl bg-[var(--color-brass)]/10 border border-[var(--color-brass)]/40 p-3 font-mono text-[11px] text-[var(--color-brass)]">
              A venda só sai para entrega após o pagamento confirmado.
            </p>
            <button
              onClick={finalizar}
              disabled={!valido}
              className="mt-4 w-full rounded-full bg-[var(--color-wa)] px-5 py-3 font-bold text-black hover:brightness-110 disabled:opacity-40"
            >
              Enviar pedido no WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
