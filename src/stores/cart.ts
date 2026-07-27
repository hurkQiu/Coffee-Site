import { computed, reactive } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

const items = reactive<CartItem[]>([])

function addItem(item: { id: string; name: string; price: number; image: string; quantity: number }) {
  const existing = items.find((i) => i.id === item.id)
  if (existing) {
    existing.quantity += item.quantity
  } else {
    items.push({ ...item })
  }
}

function removeItem(id: string) {
  const index = items.findIndex((i) => i.id === id)
  if (index !== -1) items.splice(index, 1)
}

function updateQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    removeItem(id)
    return
  }
  const existing = items.find((i) => i.id === id)
  if (existing) existing.quantity = quantity
}

const totalCount = computed(() => items.reduce((sum, item) => sum + item.quantity, 0))
const totalPrice = computed(() => items.reduce((sum, item) => sum + item.quantity * item.price, 0))

export function useCart() {
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    totalCount,
    totalPrice,
  }
}
