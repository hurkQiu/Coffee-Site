import { computed } from 'vue'
import { persistedRef, persistedSetRef } from '@/utils/persist'

export interface CoffeeBean {
  id: number
  name: string
  price: number
  image: string
  stock: number
  roast: string
  process: string
}

const DEFAULT_ROAST_LEVELS = ['淺焙', '中焙', '深焙']
const DEFAULT_PROCESS_METHODS = ['水洗', '日曬', '蜜處理', '厭氧']

const DEFAULT_BEANS: CoffeeBean[] = [
  { id: 1, name: '耶加雪菲', price: 380, image: '', stock: 12, roast: '淺焙', process: '水洗' },
  { id: 2, name: '西達摩', price: 360, image: '', stock: 8, roast: '淺焙', process: '日曬' },
  { id: 3, name: '藝伎莊園', price: 520, image: '', stock: 3, roast: '淺焙', process: '蜜處理' },
  { id: 4, name: '瑰夏厭氧', price: 620, image: '', stock: 0, roast: '淺焙', process: '厭氧' },
  { id: 5, name: '曼特寧', price: 340, image: '', stock: 20, roast: '中焙', process: '水洗' },
  { id: 6, name: '哥倫比亞', price: 350, image: '', stock: 15, roast: '中焙', process: '蜜處理' },
  { id: 7, name: '巴西聖多斯', price: 300, image: '', stock: 25, roast: '深焙', process: '日曬' },
  { id: 8, name: '摩卡爪哇', price: 390, image: '', stock: 6, roast: '深焙', process: '厭氧' },
]

const beans = persistedRef<CoffeeBean[]>('coffee-site:beans', DEFAULT_BEANS)
const roastLevels = persistedRef<string[]>('coffee-site:roast-levels', DEFAULT_ROAST_LEVELS)
const processMethods = persistedRef<string[]>('coffee-site:process-methods', DEFAULT_PROCESS_METHODS)
const hiddenRoasts = persistedSetRef('coffee-site:hidden-roasts')
const hiddenProcesses = persistedSetRef('coffee-site:hidden-processes')

const visibleRoastLevels = computed(() => roastLevels.value.filter((r) => !hiddenRoasts.value.has(r)))
const visibleProcessMethods = computed(() => processMethods.value.filter((p) => !hiddenProcesses.value.has(p)))

function getBeanById(id: number): CoffeeBean | null {
  return beans.value.find((b) => b.id === id) ?? null
}

function nextBeanId() {
  return Math.max(0, ...beans.value.map((b) => b.id)) + 1
}

function addBean(payload: Omit<CoffeeBean, 'id'>) {
  const bean: CoffeeBean = { id: nextBeanId(), ...payload }
  beans.value.push(bean)
  return bean
}

function updateBean(id: number, payload: Omit<CoffeeBean, 'id'>) {
  const target = beans.value.find((b) => b.id === id)
  if (!target) return
  Object.assign(target, payload)
}

function removeBean(id: number) {
  const index = beans.value.findIndex((b) => b.id === id)
  if (index !== -1) beans.value.splice(index, 1)
}

function addRoastLevel(value: string) {
  if (!roastLevels.value.includes(value)) roastLevels.value.push(value)
}

function addProcessMethod(value: string) {
  if (!processMethods.value.includes(value)) processMethods.value.push(value)
}

function toggleRoastHidden(value: string) {
  const next = new Set(hiddenRoasts.value)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  hiddenRoasts.value = next
}

function toggleProcessHidden(value: string) {
  const next = new Set(hiddenProcesses.value)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  hiddenProcesses.value = next
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
