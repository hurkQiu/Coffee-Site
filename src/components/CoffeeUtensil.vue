<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ShopItem from './ShopItem.vue'
import { useCart } from '@/stores/cart'

const { addItem } = useCart()
const route = useRoute()

type UtensilCategory = '濾杯' | '磨豆機' | '耗材' | '其餘用具'

interface CoffeeUtensilItem {
  id: number
  name: string
  price: number
  image: string
  category: UtensilCategory
}

const categories: UtensilCategory[] = ['濾杯', '磨豆機', '耗材', '其餘用具']

const utensils: CoffeeUtensilItem[] = [
  { id: 1, name: 'V60 濾杯', price: 450, image: "", category: '濾杯' },
  { id: 2, name: '蛋糕型濾杯', price: 380, image: "", category: '濾杯' },
  { id: 3, name: '手搖磨豆機', price: 1200, image: "", category: '磨豆機' },
  { id: 4, name: '電動磨豆機', price: 3200, image: "", category: '磨豆機' },
  { id: 5, name: '濾紙 100 入', price: 150, image: "", category: '耗材' },
  { id: 6, name: '濾布', price: 220, image: "", category: '耗材' },
  { id: 7, name: '手沖壺', price: 890, image: "", category: '其餘用具' },
  { id: 8, name: '電子秤', price: 650, image: "", category: '其餘用具' },
]

function isUtensilCategory(value: unknown): value is UtensilCategory {
  return typeof value === 'string' && (categories as string[]).includes(value)
}

const selectedCategory = ref<UtensilCategory | null>(
  isUtensilCategory(route.query.category) ? route.query.category : null,
)

watch(
  () => route.query.category,
  (value) => {
    selectedCategory.value = isUtensilCategory(value) ? value : null
  },
)

function toggleCategory(category: UtensilCategory) {
  selectedCategory.value = selectedCategory.value === category ? null : category
}

const filteredUtensils = computed(() =>
  utensils.filter((item) => !selectedCategory.value || item.category === selectedCategory.value),
)

function handleAddToCart(payload: { id: string; quantity: number }) {
  const utensil = utensils.find((u) => `utensil-${u.id}` === payload.id)
  if (!utensil) return
  addItem({
    id: payload.id,
    name: utensil.name,
    price: utensil.price,
    image: utensil.image,
    quantity: payload.quantity,
  })
}
</script>

<template>
  <div class="coffee-utensil">
    <aside class="filter">
      <div class="filter__group">
        <h3 class="filter__title">類別</h3>
        <ul class="filter__list">
          <li v-for="category in categories" :key="category">
            <button
              type="button"
              class="filter__item"
              :class="{ 'filter__item--active': selectedCategory === category }"
              @click="toggleCategory(category)"
            >
              {{ category }}
            </button>
          </li>
        </ul>
      </div>
    </aside>

    <section class="products">
      <ShopItem
        v-for="utensil in filteredUtensils"
        :key="utensil.id"
        :id="`utensil-${utensil.id}`"
        :name="utensil.name"
        :price="utensil.price"
        :image="utensil.image"
        @add-to-cart="handleAddToCart"
      />
    </section>
  </div>
</template>

<style scoped>
.coffee-utensil {
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
  .coffee-utensil {
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
