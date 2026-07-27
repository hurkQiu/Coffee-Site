<script setup lang="ts">
import { computed, ref } from 'vue'
import IconImagePlaceholder from './icons/IconImagePlaceholder.vue'
import IconHeart from './icons/IconHeart.vue'
import { useWishlist } from '@/stores/wishlist'
import { simulateDelay } from '@/utils/async'
import { RouteName } from '@/router/routeName'

const props = defineProps<{
  id: string
  name: string
  price: number
  image: string
  stock: number
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', payload: { id: string; quantity: number }): void
}>()

const { isWishlisted, toggleWishlist } = useWishlist()

const quantity = ref(props.stock > 0 ? 1 : 0)
const isAdding = ref(false)

const detailRoute = computed(() => {
  const [prefix, rawId] = props.id.split('-')
  const type = prefix === 'utensil' ? 'utensil' : 'bean'
  return { name: RouteName.PRODUCT_DETAIL, params: { type, id: rawId } }
})

function decrease() {
  if (quantity.value > 1) quantity.value--
}

function increase() {
  if (quantity.value < props.stock) quantity.value++
}

async function addToCart() {
  if (props.stock <= 0 || isAdding.value) return
  isAdding.value = true
  await simulateDelay(400)
  emit('add-to-cart', { id: props.id, quantity: quantity.value })
  isAdding.value = false
}
</script>

<template>
  <div class="shop-item">
    <div class="shop-item__image">
      <RouterLink :to="detailRoute" class="shop-item__image-link">
        <img v-if="image" :src="image" :alt="name" />
        <IconImagePlaceholder v-else class="shop-item__image-placeholder" />
      </RouterLink>
      <span v-if="stock <= 0" class="shop-item__out-of-stock">缺貨中</span>
      <button
        type="button"
        class="shop-item__wishlist"
        :class="{ 'shop-item__wishlist--active': isWishlisted(id) }"
        :aria-pressed="isWishlisted(id)"
        aria-label="加入收藏"
        @click="toggleWishlist(id)"
      >
        <IconHeart :filled="isWishlisted(id)" />
      </button>
    </div>
    <RouterLink :to="detailRoute" class="shop-item__name">{{ name }}</RouterLink>
    <p class="shop-item__price">NT$ {{ price }}</p>
    <p class="shop-item__stock" :class="{ 'shop-item__stock--low': stock > 0 && stock <= 5 }">
      {{ stock > 0 ? `剩餘 ${stock} 件` : '缺貨中' }}
    </p>
    <div class="shop-item__actions">
      <div class="shop-item__quantity">
        <button type="button" aria-label="減少數量" :disabled="stock <= 0" @click="decrease">-</button>
        <span>{{ quantity }}</span>
        <button
          type="button"
          aria-label="增加數量"
          :disabled="stock <= 0 || quantity >= stock"
          @click="increase"
        >+</button>
      </div>
      <button type="button" class="shop-item__add" :disabled="stock <= 0 || isAdding" @click="addToCart">
        {{ isAdding ? '加入中...' : '加入購物車' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.shop-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background-soft);
}

.shop-item__image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-background-mute);
}

.shop-item__image-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.shop-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shop-item__image-placeholder {
  width: 40%;
  height: 40%;
  color: var(--color-border-hover);
}

.shop-item__out-of-stock {
  position: absolute;
  bottom: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 0.75rem;
}

.shop-item__wishlist {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  color: var(--color-text);
  cursor: pointer;
}

.shop-item__wishlist svg {
  width: 16px;
  height: 16px;
}

.shop-item__wishlist--active {
  color: #b04a4a;
}

.shop-item__name {
  margin: 0;
  font-size: 1rem;
  color: var(--color-heading);
  text-decoration: none;
}

.shop-item__name:hover {
  text-decoration: underline;
}

.shop-item__price {
  margin: 0;
  font-size: 0.95rem;
  font-weight: bold;
  color: var(--color-text);
}

.shop-item__stock {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
}

.shop-item__stock--low {
  color: #b04a4a;
  opacity: 1;
}

.shop-item__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
}

.shop-item__quantity {
  display: flex;
  align-items: center;
  gap: 6px;
}

.shop-item__quantity button {
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
}

.shop-item__quantity button:hover:not(:disabled) {
  border-color: var(--color-border-hover);
}

.shop-item__quantity button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.shop-item__add {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
}

.shop-item__add:hover:not(:disabled) {
  background: hsla(160, 100%, 32%, 1);
}

.shop-item__add:disabled {
  background: var(--color-border-hover);
  cursor: not-allowed;
}
</style>
