import { computed, ref } from 'vue'
import { api } from '@/lib/api'

export interface CoffeeUtensilItem {
  id: number
  name: string
  price: number
  image: string
  stock: number
  category: string
}

interface NamedOption {
  name: string
  hidden: boolean
}

const utensils = ref<CoffeeUtensilItem[]>([])
const categoryOptions = ref<NamedOption[]>([])

const categories = computed(() => categoryOptions.value.map((o) => o.name))
const hiddenCategories = computed(() => new Set(categoryOptions.value.filter((o) => o.hidden).map((o) => o.name)))
const visibleCategories = computed(() => categoryOptions.value.filter((o) => !o.hidden).map((o) => o.name))

let loaded = false

async function load(force = false) {
  if (loaded && !force) return
  const [utensilList, cats] = await Promise.all([
    api.get<CoffeeUtensilItem[]>('/utensils'),
    api.get<NamedOption[]>('/utensils/categories'),
  ])
  utensils.value = utensilList
  categoryOptions.value = cats
  loaded = true
}

function getUtensilById(id: number): CoffeeUtensilItem | null {
  return utensils.value.find((u) => u.id === id) ?? null
}

async function addUtensil(payload: Omit<CoffeeUtensilItem, 'id'>) {
  const utensil = await api.post<CoffeeUtensilItem>('/utensils', payload, { auth: true })
  utensils.value.push(utensil)
  return utensil
}

async function updateUtensil(id: number, payload: Omit<CoffeeUtensilItem, 'id'>) {
  const utensil = await api.put<CoffeeUtensilItem>(`/utensils/${id}`, payload, { auth: true })
  const index = utensils.value.findIndex((u) => u.id === id)
  if (index !== -1) utensils.value[index] = utensil
  return utensil
}

async function removeUtensil(id: number) {
  await api.delete(`/utensils/${id}`, { auth: true })
  const index = utensils.value.findIndex((u) => u.id === id)
  if (index !== -1) utensils.value.splice(index, 1)
}

async function addCategory(value: string) {
  categoryOptions.value = await api.post<NamedOption[]>('/utensils/categories', { name: value }, { auth: true })
}

async function toggleCategoryHidden(value: string) {
  categoryOptions.value = await api.patch<NamedOption[]>(
    `/utensils/categories/${encodeURIComponent(value)}/toggle-hidden`,
    undefined,
    { auth: true },
  )
}

export function useUtensils() {
  return {
    utensils,
    categories,
    hiddenCategories,
    visibleCategories,
    load,
    getUtensilById,
    addUtensil,
    updateUtensil,
    removeUtensil,
    addCategory,
    toggleCategoryHidden,
  }
}
