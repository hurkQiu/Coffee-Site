import { computed, reactive } from 'vue'
import { api } from '@/lib/api'
import { useToast } from '@/stores/toast'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

const items = reactive<CartItem[]>([])
let loaded = false

function reportError(fallbackMessage: string) {
  const { showToast } = useToast()
  showToast(fallbackMessage, 'error')
}

async function reload() {
  const serverItems = await api.get<CartItem[]>('/cart', { guest: true })
  items.splice(0, items.length, ...serverItems)
}

async function load(force = false) {
  if (loaded && !force) return
  await reload()
  loaded = true
}

function addItem(item: { id: string; name: string; price: number; image: string; quantity: number }) {
  const existing = items.find((i) => i.id === item.id)
  if (existing) {
    existing.quantity += item.quantity
  } else {
    items.push({ ...item })
  }

  api.post('/cart/items', item, { guest: true }).catch(() => {
    reload().catch(() => undefined)
    reportError('加入購物車失敗，請稍後再試')
  })
}

function removeItem(id: string) {
  const index = items.findIndex((i) => i.id === id)
  if (index !== -1) items.splice(index, 1)

  api.delete(`/cart/items/${encodeURIComponent(id)}`, { guest: true }).catch(() => {
    reload().catch(() => undefined)
    reportError('移除商品失敗，請稍後再試')
  })
}

function updateQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    removeItem(id)
    return
  }
  const existing = items.find((i) => i.id === id)
  if (existing) existing.quantity = quantity

  api.patch(`/cart/items/${encodeURIComponent(id)}`, { quantity }, { guest: true }).catch(() => {
    reload().catch(() => undefined)
    reportError('更新數量失敗，請稍後再試')
  })
}

function clearCart() {
  items.splice(0, items.length)

  api.delete('/cart', { guest: true }).catch(() => {
    reload().catch(() => undefined)
    reportError('清空購物車失敗，請稍後再試')
  })
}

const totalCount = computed(() => items.reduce((sum, item) => sum + item.quantity, 0))
const totalPrice = computed(() => items.reduce((sum, item) => sum + item.quantity * item.price, 0))

export function useCart() {
  return {
    items,
    load,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    totalPrice,
  }
}
