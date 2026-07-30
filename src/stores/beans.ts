import { computed, ref } from 'vue'
import { api } from '@/lib/api'

export interface CoffeeBean {
  id: number
  name: string
  price: number
  image: string
  stock: number
  roast: string
  process: string
}

interface NamedOption {
  name: string
  hidden: boolean
}

const beans = ref<CoffeeBean[]>([])
const roastOptions = ref<NamedOption[]>([])
const processOptions = ref<NamedOption[]>([])

const roastLevels = computed(() => roastOptions.value.map((o) => o.name))
const processMethods = computed(() => processOptions.value.map((o) => o.name))
const hiddenRoasts = computed(() => new Set(roastOptions.value.filter((o) => o.hidden).map((o) => o.name)))
const hiddenProcesses = computed(() => new Set(processOptions.value.filter((o) => o.hidden).map((o) => o.name)))

const visibleRoastLevels = computed(() => roastOptions.value.filter((o) => !o.hidden).map((o) => o.name))
const visibleProcessMethods = computed(() => processOptions.value.filter((o) => !o.hidden).map((o) => o.name))

let loaded = false

async function load(force = false) {
  if (loaded && !force) return
  const [beanList, roasts, processes] = await Promise.all([
    api.get<CoffeeBean[]>('/beans'),
    api.get<NamedOption[]>('/beans/roast-levels'),
    api.get<NamedOption[]>('/beans/process-methods'),
  ])
  beans.value = beanList
  roastOptions.value = roasts
  processOptions.value = processes
  loaded = true
}

function getBeanById(id: number): CoffeeBean | null {
  return beans.value.find((b) => b.id === id) ?? null
}

async function addBean(payload: Omit<CoffeeBean, 'id'>) {
  const bean = await api.post<CoffeeBean>('/beans', payload, { auth: true })
  beans.value.push(bean)
  return bean
}

async function updateBean(id: number, payload: Omit<CoffeeBean, 'id'>) {
  const bean = await api.put<CoffeeBean>(`/beans/${id}`, payload, { auth: true })
  const index = beans.value.findIndex((b) => b.id === id)
  if (index !== -1) beans.value[index] = bean
  return bean
}

async function removeBean(id: number) {
  await api.delete(`/beans/${id}`, { auth: true })
  const index = beans.value.findIndex((b) => b.id === id)
  if (index !== -1) beans.value.splice(index, 1)
}

async function addRoastLevel(value: string) {
  roastOptions.value = await api.post<NamedOption[]>('/beans/roast-levels', { name: value }, { auth: true })
}

async function addProcessMethod(value: string) {
  processOptions.value = await api.post<NamedOption[]>('/beans/process-methods', { name: value }, { auth: true })
}

async function toggleRoastHidden(value: string) {
  roastOptions.value = await api.patch<NamedOption[]>(
    `/beans/roast-levels/${encodeURIComponent(value)}/toggle-hidden`,
    undefined,
    { auth: true },
  )
}

async function toggleProcessHidden(value: string) {
  processOptions.value = await api.patch<NamedOption[]>(
    `/beans/process-methods/${encodeURIComponent(value)}/toggle-hidden`,
    undefined,
    { auth: true },
  )
}

export function useBeans() {
  return {
    beans,
    roastLevels,
    processMethods,
    hiddenRoasts,
    hiddenProcesses,
    visibleRoastLevels,
    visibleProcessMethods,
    load,
    getBeanById,
    addBean,
    updateBean,
    removeBean,
    addRoastLevel,
    addProcessMethod,
    toggleRoastHidden,
    toggleProcessHidden,
  }
}
