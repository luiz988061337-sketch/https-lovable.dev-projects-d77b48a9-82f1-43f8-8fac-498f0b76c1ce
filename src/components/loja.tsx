import { useEffect, useState } from 'react'
import {
  DEFAULT_CATALOG,
  DEFAULT_CONFIG,
  loadCart,
  loadCatalog,
  loadConfig,
  loadOrders,
  saveCart,
  saveCatalog,
  saveConfig,
  saveOrders,
  type CartItem,
  type CatalogProduct,
  type LojaConfig,
  type Order,
} from '../data/loja'

export function useCatalog() {
  const [catalog, setCatalog] = useState<CatalogProduct[]>(DEFAULT_CATALOG)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setCatalog(loadCatalog())
    setReady(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'lmartins-catalogo-v1') setCatalog(loadCatalog())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  function update(next: CatalogProduct[]) {
    setCatalog(next)
    saveCatalog(next)
  }
  return { catalog: catalog.filter((p) => p.ativo), all: catalog, update, ready }
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  useEffect(() => {
    setCart(loadCart())
  }, [])
  function update(next: CartItem[]) {
    setCart(next)
    saveCart(next)
  }
  function add(p: CatalogProduct) {
    const found = cart.find((i) => i.id === p.id)
    update(
      found
        ? cart.map((i) => (i.id === p.id ? { ...i, qtd: i.qtd + 1 } : i))
        : [...cart, { id: p.id, nome: p.nome, preco: p.preco, qtd: 1 }],
    )
  }
  function setQtd(id: string, qtd: number) {
    update(qtd <= 0 ? cart.filter((i) => i.id !== id) : cart.map((i) => (i.id === id ? { ...i, qtd } : i)))
  }
  function clear() {
    update([])
  }
  const count = cart.reduce((t, i) => t + i.qtd, 0)
  return { cart, add, setQtd, clear, count }
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setOrders(loadOrders())
    setReady(true)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'lmartins-pedidos-v1') setOrders(loadOrders())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  function update(next: Order[]) {
    setOrders(next)
    saveOrders(next)
  }
  return { orders, update, ready }
}

export function useLojaConfig() {
  const [config, setConfig] = useState<LojaConfig>(DEFAULT_CONFIG)
  useEffect(() => {
    setConfig(loadConfig())
  }, [])
  function update(next: LojaConfig) {
    setConfig(next)
    saveConfig(next)
  }
  return { config, update }
}
