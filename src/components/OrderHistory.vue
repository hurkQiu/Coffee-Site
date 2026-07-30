<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouteName } from '@/router/routeName'
import { api, ApiError } from '@/lib/api'
import { useAuth } from '@/stores/auth'
import IconImagePlaceholder from './icons/IconImagePlaceholder.vue'

interface OrderItem {
  name: string
  image: string
  quantity: number
  price: number
}

interface Order {
  id: number
  orderNumber: string
  createdAt: string
  items: OrderItem[]
  totalPrice: number
}

const { isLoggedIn } = useAuth()

const orders = ref<Order[]>([])
const isLoading = ref(false)
const error = ref('')

async function fetchOrders() {
  isLoading.value = true
  error.value = ''
  try {
    orders.value = await api.get<Order[]>('/orders', { auth: true })
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : '載入訂單失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (isLoggedIn.value) fetchOrders()
})

const sortedOrders = computed(() => [...orders.value].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))

const expandedIds = ref<Set<string>>(new Set())

function isExpanded(id: string) {
  return expandedIds.value.has(id)
}

function toggleExpand(id: string) {
  const next = new Set(expandedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expandedIds.value = next
}

function formatDate(isoStr: string) {
  const date = new Date(isoStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<template>
  <div class="order-history">
    <h1 class="order-history__title">訂單紀錄</h1>

    <p v-if="!isLoggedIn" class="order-history__empty">請先登入才能查看訂單紀錄</p>
    <p v-else-if="isLoading" class="order-history__empty">載入中...</p>
    <p v-else-if="error" class="order-history__empty">{{ error }}</p>
    <p v-else-if="sortedOrders.length === 0" class="order-history__empty">尚無訂單紀錄</p>

    <ul v-else class="order-list">
      <li v-for="order in sortedOrders" :key="order.orderNumber" class="order-card">
        <div class="order-card__header">
          <span class="order-card__id">訂單編號：{{ order.orderNumber }}</span>
          <button type="button" class="order-card__toggle" @click="toggleExpand(order.orderNumber)">
            {{ isExpanded(order.orderNumber) ? '收合' : '展開' }}
            <span class="order-card__chevron" :class="{ 'order-card__chevron--open': isExpanded(order.orderNumber) }">▾</span>
          </button>
        </div>

        <ul class="order-card__items">
          <li
            v-for="item in (isExpanded(order.orderNumber) ? order.items : order.items.slice(0, 1))"
            :key="item.name"
            class="order-item"
          >
            <div class="order-item__image">
              <img v-if="item.image" :src="item.image" :alt="item.name" />
              <IconImagePlaceholder v-else class="order-item__image-placeholder" />
            </div>
            <span class="order-item__name">{{ item.name }}</span>
            <span class="order-item__qty">x{{ item.quantity }}</span>
            <span class="order-item__price">NT$ {{ item.price * item.quantity }}</span>
          </li>
        </ul>
        <p v-if="!isExpanded(order.orderNumber) && order.items.length > 1" class="order-card__more">
          其餘 {{ order.items.length - 1 }} 項商品…
        </p>

        <div class="order-card__footer">
          <div class="order-card__summary">
            <span class="order-card__date">{{ formatDate(order.createdAt) }}</span>
            <span class="order-card__total">總計 NT$ {{ order.totalPrice }}</span>
          </div>
          <RouterLink
            :to="{ name: RouteName.CONTACT, query: { orderId: order.orderNumber } }"
            class="order-card__contact"
          >回報客服</RouterLink>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.order-history {
  width: 100%;
}

.order-history__title {
  margin-bottom: 20px;
  font-size: 1.4rem;
  color: var(--color-heading);
}

.order-history__empty {
  padding: 60px 0;
  text-align: center;
  color: var(--color-text);
  opacity: 0.7;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.order-card {
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-background-soft);
}

.order-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.order-card__id {
  font-weight: bold;
  color: var(--color-heading);
}

.order-card__toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-background);
  color: var(--color-brand);
  cursor: pointer;
  white-space: nowrap;
}

.order-card__chevron {
  display: inline-block;
  transition: transform 0.2s;
}

.order-card__chevron--open {
  transform: rotate(180deg);
}

.order-card__items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0 0 4px;
  padding: 0;
  list-style: none;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-item__image {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-background-mute);
}

.order-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-item__image-placeholder {
  width: 45%;
  height: 45%;
  color: var(--color-border-hover);
}

.order-item__name {
  flex: 1;
  color: var(--color-text);
}

.order-item__qty {
  color: var(--color-text);
  opacity: 0.75;
}

.order-item__price {
  font-weight: bold;
  color: var(--color-heading);
  white-space: nowrap;
}

.order-card__more {
  margin: 0 0 8px;
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.7;
}

.order-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.order-card__summary {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--color-text);
}

.order-card__total {
  font-weight: bold;
  color: var(--color-heading);
}

.order-card__contact {
  padding: 8px 16px;
  border-radius: 6px;
  background: var(--color-brand);
  color: var(--color-on-brand);
  text-decoration: none;
  font-size: 0.9rem;
  white-space: nowrap;
}

.order-card__contact:hover {
  background: var(--color-brand-dark);
}
</style>
