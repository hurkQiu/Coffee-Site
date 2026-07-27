<script setup lang="ts">
import { ref } from 'vue'
import IconImagePlaceholder from './icons/IconImagePlaceholder.vue'

const props = defineProps<{
  id: string
  name: string
  price: number
  image: string
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', payload: { id: string; quantity: number }): void
}>()

const quantity = ref(1)

function decrease() {
  if (quantity.value > 1) quantity.value--
}

function increase() {
  quantity.value++
}

function addToCart() {
  emit('add-to-cart', { id: props.id, quantity: quantity.value })
}
</script>

<template>
  <div class="shop-item">
    <div class="shop-item__image">
      <img v-if="image" :src="image" :alt="name" />
      <IconImagePlaceholder v-else class="shop-item__image-placeholder" />
    </div>
    <h3 class="shop-item__name">{{ name }}</h3>
    <p class="shop-item__price">NT$ {{ price }}</p>
    <div class="shop-item__actions">
      <div class="shop-item__quantity">
        <button type="button" @click="decrease">-</button>
        <span>{{ quantity }}</span>
        <button type="button" @click="increase">+</button>
      </div>
      <button type="button" class="shop-item__add" @click="addToCart">加入購物車</button>
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-background-mute);
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

.shop-item__name {
  margin: 0;
  font-size: 1rem;
  color: var(--color-heading);
}

.shop-item__price {
  margin: 0;
  font-size: 0.95rem;
  font-weight: bold;
  color: var(--color-text);
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

.shop-item__quantity button:hover {
  border-color: var(--color-border-hover);
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

.shop-item__add:hover {
  background: hsla(160, 100%, 32%, 1);
}
</style>
