<script setup lang="ts">
import { computed } from 'vue'
import { useWishlist } from '@/stores/wishlist'
import { useBeans } from '@/stores/beans'
import { useUtensils } from '@/stores/utensils'
import { useCart } from '@/stores/cart'
import { useToast } from '@/stores/toast'
import ShopItem from './ShopItem.vue'

const { wishlistIds } = useWishlist()
const { beans } = useBeans()
const { utensils } = useUtensils()
const { addItem } = useCart()
const { showToast } = useToast()

interface WishlistProduct {
  id: string
  name: string
  price: number
  image: string
  stock: number
}

const wishlistedProducts = computed<WishlistProduct[]>(() => {
  const results: WishlistProduct[] = []
  for (const id of wishlistIds.value) {
    if (id.startsWith('bean-')) {
      const beanId = Number(id.slice('bean-'.length))
      const bean = beans.value.find((b) => b.id === beanId)
      if (bean) results.push({ id, name: bean.name, price: bean.price, image: bean.image, stock: bean.stock })
    } else if (id.startsWith('utensil-')) {
      const utensilId = Number(id.slice('utensil-'.length))
      const utensil = utensils.value.find((u) => u.id === utensilId)
      if (utensil) results.push({ id, name: utensil.name, price: utensil.price, image: utensil.image, stock: utensil.stock })
    }
  }
  return results
})

function handleAddToCart(payload: { id: string; quantity: number }) {
  const product = wishlistedProducts.value.find((p) => p.id === payload.id)
  if (!product) return
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: payload.quantity,
  })
  showToast(`已加入購物車：${product.name}`, 'success')
}
</script>

<template>
  <div class="wishlist-page">
    <h1 class="wishlist-page__title">我的收藏</h1>

    <p v-if="wishlistedProducts.length === 0" class="wishlist-page__empty">尚未收藏任何商品</p>

    <div v-else class="wishlist-page__grid">
      <ShopItem
        v-for="product in wishlistedProducts"
        :key="product.id"
        :id="product.id"
        :name="product.name"
        :price="product.price"
        :image="product.image"
        :stock="product.stock"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<style scoped>
.wishlist-page {
  width: 100%;
}

.wishlist-page__title {
  margin-bottom: 20px;
  font-size: 1.4rem;
  color: var(--color-heading);
}

.wishlist-page__empty {
  padding: 60px 0;
  text-align: center;
  color: var(--color-text);
  opacity: 0.7;
}

.wishlist-page__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (min-width: 700px) {
  .wishlist-page__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1000px) {
  .wishlist-page__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
