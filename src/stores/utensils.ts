import { computed } from 'vue'
import { persistedRef, persistedSetRef } from '@/utils/persist'

export interface CoffeeUtensilItem {
  id: number
  name: string
  price: number
  image: string
  stock: number
  category: string
}

const DEFAULT_CATEGORIES = ['濾杯', '磨豆機', '耗材', '其餘用具']

const DEFAULT_UTENSILS: CoffeeUtensilItem[] = [
  { id: 1, name: 'V60 濾杯', price: 450, image: '', stock: 14, category: '濾杯' },
  { id: 2, name: '蛋糕型濾杯', price: 380, image: '', stock: 9, category: '濾杯' },
  { id: 3, name: '手搖磨豆機', price: 1200, image: '', stock: 5, category: '磨豆機' },
  { id: 4, name: '電動磨豆機', price: 3200, image: '', stock: 0, category: '磨豆機' },
  { id: 5, name: '濾紙 100 入', price: 150, image: '', stock: 40, category: '耗材' },
  { id: 6, name: '濾布', price: 220, image: '', stock: 18, category: '耗材' },
  { id: 7, name: '手沖壺', price: 890, image: '', stock: 7, category: '其餘用具' },
  { id: 8, name: '電子秤', price: 650, image: '', stock: 3, category: '其餘用具' },
]

const utensils = persistedRef<CoffeeUtensilItem[]>('coffee-site:utensils', DEFAULT_UTENSILS)
const categories = persistedRef<string[]>('coffee-site:utensil-categories', DEFAULT_CATEGORIES)
const hiddenCategories = persistedSetRef('coffee-site:hidden-utensil-categories')

const visibleCategories = computed(() => categories.value.filter((c) => !hiddenCategories.value.has(c)))

function getUtensilById(id: number): CoffeeUtensilItem | null {
  return utensils.value.find((u) => u.id === id) ?? null
}

function nextUtensilId() {
  return Math.max(0, ...utensils.value.map((u) => u.id)) + 1
}

function addUtensil(payload: Omit<CoffeeUtensilItem, 'id'>) {
  const utensil: CoffeeUtensilItem = { id: nextUtensilId(), ...payload }
  utensils.value.push(utensil)
  return utensil
}

function updateUtensil(id: number, payload: Omit<CoffeeUtensilItem, 'id'>) {
  const target = utensils.value.find((u) => u.id === id)
  if (!target) return
  Object.assign(target, payload)
}

function removeUtensil(id: number) {
  const index = utensils.value.findIndex((u) => u.id === id)
  if (index !== -1) utensils.value.splice(index, 1)
}

function addCategory(value: string) {
  if (!categories.value.includes(value)) categories.value.push(value)
}

function toggleCategoryHidden(value: string) {
  const next = new Set(hiddenCategories.value)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  hiddenCategories.value = next
}

export function useUtensils() {
  return {
    utensils,
    categories,
    hiddenCategories,
    visibleCategories,
    getUtensilById,
    addUtensil,
    updateUtensil,
    removeUtensil,
    addCategory,
    toggleCategoryHidden,
  }
}
