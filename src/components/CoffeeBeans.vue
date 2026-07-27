<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ShopItem from './ShopItem.vue'
import { useCart } from '@/stores/cart'

const { addItem } = useCart()
const route = useRoute()

type RoastLevel = '淺焙' | '中焙' | '深焙'
type ProcessMethod = '水洗' | '日曬' | '蜜處理' | '厭氧'

interface CoffeeBean {
  id: number
  name: string
  price: number
  image: string
  roast: RoastLevel
  process: ProcessMethod
}

const roastLevels: RoastLevel[] = ['淺焙', '中焙', '深焙']
const processMethods: ProcessMethod[] = ['水洗', '日曬', '蜜處理', '厭氧']

const beans: CoffeeBean[] = [
  { id: 1, name: '耶加雪菲', price: 380, image: "", roast: '淺焙', process: '水洗' },
  { id: 2, name: '西達摩', price: 360, image: "", roast: '淺焙', process: '日曬' },
  { id: 3, name: '藝伎莊園', price: 520, image: "", roast: '淺焙', process: '蜜處理' },
  { id: 4, name: '瑰夏厭氧', price: 620, image: "", roast: '淺焙', process: '厭氧' },
  { id: 5, name: '曼特寧', price: 340, image: "", roast: '中焙', process: '水洗' },
  { id: 6, name: '哥倫比亞', price: 350, image: "", roast: '中焙', process: '蜜處理' },
  { id: 7, name: '巴西聖多斯', price: 300, image: "", roast: '深焙', process: '日曬' },
  { id: 8, name: '摩卡爪哇', price: 390, image: "", roast: '深焙', process: '厭氧' },
]

function isRoastLevel(value: unknown): value is RoastLevel {
  return typeof value === 'string' && (roastLevels as string[]).includes(value)
}

const selectedRoast = ref<RoastLevel | null>(
  isRoastLevel(route.query.roast) ? route.query.roast : null,
)
const selectedProcess = ref<ProcessMethod | null>(null)

watch(
  () => route.query.roast,
  (value) => {
    selectedRoast.value = isRoastLevel(value) ? value : null
  },
)

function toggleRoast(roast: RoastLevel) {
  selectedRoast.value = selectedRoast.value === roast ? null : roast
}

function toggleProcess(process: ProcessMethod) {
  selectedProcess.value = selectedProcess.value === process ? null : process
}

const filteredBeans = computed(() =>
  beans.filter(
    (bean) =>
      (!selectedRoast.value || bean.roast === selectedRoast.value) &&
      (!selectedProcess.value || bean.process === selectedProcess.value),
  ),
)

function handleAddToCart(payload: { id: string; quantity: number }) {
  const bean = beans.find((b) => `bean-${b.id}` === payload.id)
  if (!bean) return
  addItem({
    id: payload.id,
    name: bean.name,
    price: bean.price,
    image: bean.image,
    quantity: payload.quantity,
  })
}
</script>

<template>
  <div class="coffee-beans">
    <aside class="filter">
      <div class="filter__group">
        <h3 class="filter__title">烘焙度</h3>
        <ul class="filter__list">
          <li v-for="roast in roastLevels" :key="roast">
            <button
              type="button"
              class="filter__item"
              :class="{ 'filter__item--active': selectedRoast === roast }"
              @click="toggleRoast(roast)"
            >
              {{ roast }}
            </button>
          </li>
        </ul>
      </div>

      <hr class="filter__divider" />

      <div class="filter__group">
        <h3 class="filter__title">處理法</h3>
        <ul class="filter__list">
          <li v-for="process in processMethods" :key="process">
            <button
              type="button"
              class="filter__item"
              :class="{ 'filter__item--active': selectedProcess === process }"
              @click="toggleProcess(process)"
            >
              {{ process }}
            </button>
          </li>
        </ul>
      </div>
    </aside>

    <section class="products">
      <ShopItem
        v-for="bean in filteredBeans"
        :key="bean.id"
        :id="`bean-${bean.id}`"
        :name="bean.name"
        :price="bean.price"
        :image="bean.image"
        @add-to-cart="handleAddToCart"
      />
    </section>
  </div>
</template>

<style scoped>
.coffee-beans {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
}

.filter {
  flex: 0 0 180px;
}

.filter__title {
  margin-bottom: 12px;
  font-size: 1.1rem;
  color: var(--color-heading);
}

.filter__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
}

.filter__item {
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.filter__item:hover {
  border-color: var(--color-border-hover);
}

.filter__item--active {
  border-color: hsla(160, 100%, 37%, 1);
  background: hsla(160, 100%, 37%, 0.15);
  color: hsla(160, 100%, 37%, 1);
}

.filter__divider {
  margin: 16px 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

.products {
  flex: 1 1 320px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (min-width: 700px) {
  .products {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1000px) {
  .products {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .coffee-beans {
    flex-direction: column;
  }

  .filter {
    width: 100%;
    flex: none;
  }

  .products {
    grid-template-columns: 1fr;
  }
}
</style>
