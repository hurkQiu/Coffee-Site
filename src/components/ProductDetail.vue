<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBeans } from '@/stores/beans'
import { useUtensils } from '@/stores/utensils'
import { useCart } from '@/stores/cart'
import { useWishlist } from '@/stores/wishlist'
import { useToast } from '@/stores/toast'
import IconImagePlaceholder from './icons/IconImagePlaceholder.vue'
import IconHeart from './icons/IconHeart.vue'

const route = useRoute()
const router = useRouter()
const { getBeanById } = useBeans()
const { getUtensilById } = useUtensils()
const { addItem } = useCart()
const { isWishlisted, toggleWishlist } = useWishlist()
const { showToast } = useToast()

const isUtensil = computed(() => route.params.type === 'utensil')
const numericId = computed(() => Number(route.params.id))

const product = computed(() => {
  if (isUtensil.value) {
    const utensil = getUtensilById(numericId.value)
    if (!utensil) return null
    return {
      id: `utensil-${utensil.id}`,
      name: utensil.name,
      price: utensil.price,
      image: utensil.image,
      stock: utensil.stock,
      tags: [utensil.category],
    }
  }
  const bean = getBeanById(numericId.value)
  if (!bean) return null
  return {
    id: `bean-${bean.id}`,
    name: bean.name,
    price: bean.price,
    image: bean.image,
    stock: bean.stock,
    tags: [bean.roast, bean.process],
  }
})

const quantity = ref(1)

function decrease() {
  if (quantity.value > 1) quantity.value--
}

function increase() {
  if (product.value && quantity.value < product.value.stock) quantity.value++
}

function handleAddToCart() {
  if (!product.value || product.value.stock <= 0) return
  addItem({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    quantity: quantity.value,
  })
  showToast(`已加入購物車：${product.value.name}`, 'success')
}

function handleToggleWishlist() {
  if (!product.value) return
  toggleWishlist(product.value.id)
}
</script>

<template>
  <div class="product-detail">
    <button type="button" class="product-detail__back" @click="router.back()">← 返回</button>

    <div v-if="!product" class="product-detail__not-found">
      <p>找不到這項商品</p>
    </div>

    <div v-else class="product-detail__content">
      <div class="product-detail__image">
        <img v-if="product.image" :src="product.image" :alt="product.name" />
        <IconImagePlaceholder v-else class="product-detail__image-placeholder" />
        <span v-if="product.stock <= 0" class="product-detail__out-of-stock">缺貨中</span>
      </div>

      <div class="product-detail__info">
        <div class="product-detail__tags">
          <span v-for="tag in product.tags" :key="tag" class="product-detail__tag">{{ tag }}</span>
        </div>
        <h1 class="product-detail__name">{{ product.name }}</h1>
        <p class="product-detail__price">NT$ {{ product.price }}</p>
        <p class="product-detail__stock" :class="{ 'product-detail__stock--low': product.stock > 0 && product.stock <= 5 }">
          {{ product.stock > 0 ? `剩餘 ${product.stock} 件` : '缺貨中' }}
        </p>

        <div class="product-detail__actions">
          <div class="product-detail__quantity">
            <button type="button" aria-label="減少數量" :disabled="product.stock <= 0" @click="decrease">-</button>
            <span>{{ quantity }}</span>
            <button
              type="button"
              aria-label="增加數量"
              :disabled="product.stock <= 0 || quantity >= product.stock"
              @click="increase"
            >+</button>
          </div>
          <button type="button" class="product-detail__add" :disabled="product.stock <= 0" @click="handleAddToCart">
            加入購物車
          </button>
          <button
            type="button"
            class="product-detail__wishlist"
            :class="{ 'product-detail__wishlist--active': isWishlisted(product.id) }"
            :aria-pressed="isWishlisted(product.id)"
            aria-label="加入收藏"
            @click="handleToggleWishlist"
          >
            <IconHeart :filled="isWishlisted(product.id)" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail {
  width: 100%;
}

.product-detail__back {
  margin-bottom: 20px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
}

.product-detail__not-found {
  padding: 60px 0;
  text-align: center;
  color: var(--color-text);
}

.product-detail__content {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.product-detail__image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 320px;
  max-width: 420px;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-background-mute);
}

.product-detail__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-detail__image-placeholder {
  width: 30%;
  height: 30%;
  color: var(--color-border-hover);
}

.product-detail__out-of-stock {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 0.85rem;
}

.product-detail__info {
  flex: 1 1 280px;
  display: flex;
  flex-direction: column;
}

.product-detail__tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.product-detail__tag {
  padding: 3px 12px;
  border-radius: 999px;
  background: hsla(160, 100%, 37%, 0.15);
  color: hsla(160, 100%, 27%, 1);
  font-size: 0.85rem;
}

.product-detail__name {
  margin-bottom: 12px;
  font-size: 1.6rem;
  color: var(--color-heading);
}

.product-detail__price {
  margin-bottom: 8px;
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--color-text);
}

.product-detail__stock {
  margin-bottom: 24px;
  color: var(--color-text);
  opacity: 0.75;
}

.product-detail__stock--low {
  color: #b04a4a;
  opacity: 1;
}

.product-detail__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.product-detail__quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-detail__quantity button {
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
}

.product-detail__quantity button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.product-detail__add {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  cursor: pointer;
}

.product-detail__add:hover:not(:disabled) {
  background: hsla(160, 100%, 32%, 1);
}

.product-detail__add:disabled {
  background: var(--color-border-hover);
  cursor: not-allowed;
}

.product-detail__wishlist {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
}

.product-detail__wishlist svg {
  width: 20px;
  height: 20px;
}

.product-detail__wishlist--active {
  border-color: #b04a4a;
  color: #b04a4a;
}
</style>
