import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useCatalog, useLojaConfig } from '../../components/loja'
import { newId, type CatalogProduct } from '../../data/loja'
import { formatBRL } from '../../data/barbearia'

export const Route = createFileRoute('/admin/catalogo')({
  head: () => ({
    meta: [
      { title: 'Editar catálogo — L MARTINS (dono)' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: AdminCatalogo,
})

function AdminCatalogo() {
  const { all, update, ready } = useCatalog()
  const { config, update: updateConfig } = useLojaConfig()
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')

  function toggle(id: string) {
    update(all.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p)))
  }
  function salvarPreco(id: string, v: string) {
    const n = Number(v)
    if (!Number.isFinite(n) || n < 0) return
    update(all.map((p) => (p.id === id ? { ...p, preco: n } : p)))
  }
  function salvarNome(id: string, v: string) {
    if (!v.trim()) return
    update(all.map((p) => (p.id === id ? { ...p, nome: v.trim() } : p)))
  }
  function excluir(id: string) {
    update(all.filter((p) => p.id !== id))
  }
  function adicionar() {
    const n = Number(preco)
    if (!nome.trim() || !Number.isFinite(n) || n < 0) return
    const item: CatalogProduct = {
      id: newId('prod'),
      nome: nome.trim(),
      desc: 'Novo item do catálogo',
      preco: n,
      tag: 'Cabelo',
      img: '/images/produto-kit.jpg',
      ativo: true,
    }
    update([...all, item])
    setNome('')
    setPreco('')
  }

  if (!ready) return <p className="mx-auto max-w-6xl px-4 py-8">Carregando…</p>

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
        Área do dono • catálogo da lojinha
      </p>
      <h1 className="font-display mt-2 text-4xl md:text-5xl">EDITAR CATÁLOGO</h1>

      <div className="glass mt-6 rounded-2xl p-5">
        <h2 className="font-display text-xl">CONFIG DA VENDA</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <label className="text-sm">
            Chave Pix do lojista
            <input
              value={config.pixKey}
              onChange={(e) => updateConfig({ ...config, pixKey: e.target.value })}
              placeholder="CPF, telefone ou e-mail"
              className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Prazo de entrega (dias úteis, máx. sugere-se 2)
            <input
              type="number"
              min={1}
              max={10}
              value={config.prazoDias}
              onChange={(e) =>
                updateConfig({ ...config, prazoDias: Math.max(1, Number(e.target.value) || 2) })
              }
              className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </div>

      <div className="glass mt-4 rounded-2xl p-5">
        <h2 className="font-display text-xl">ADICIONAR PRODUTO</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do produto"
            className="flex-1 min-w-44 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm"
          />
          <input
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Preço R$"
            inputMode="numeric"
            className="w-32 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm"
          />
          <button onClick={adicionar} className="rounded-full bg-[var(--color-wa)] px-5 py-2 text-sm font-bold text-black">
            + Adicionar
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {all.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => toggle(p.id)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${p.ativo ? 'bg-[var(--color-wa)]' : 'bg-white/15'}`}
              aria-label={`Alternar ${p.nome}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full transition-all ${p.ativo ? 'left-6 bg-black' : 'left-1 bg-white'}`} />
            </button>
            <input
              defaultValue={p.nome}
              onBlur={(e) => salvarNome(p.id, e.target.value)}
              className="min-w-40 flex-1 rounded-lg bg-black/30 border border-white/10 px-2 py-1.5 text-sm font-semibold"
            />
            <span className="font-mono text-[11px] text-white/40">{p.tag}</span>
            <label className="font-mono text-xs text-white/60">
              R${' '}
              <input
                defaultValue={p.preco}
                onBlur={(e) => salvarPreco(p.id, e.target.value)}
                inputMode="numeric"
                className="w-20 rounded-lg bg-black/30 border border-white/10 px-2 py-1.5 text-sm"
              />
            </label>
            <span className="font-display">{formatBRL(p.preco)}</span>
            <button onClick={() => excluir(p.id)} className="rounded-full border border-red-400/40 px-3 py-1 font-mono text-[11px] text-red-300">
              excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
