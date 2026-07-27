<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouteName } from '@/router/routeName'
import IconImagePlaceholder from './icons/IconImagePlaceholder.vue'

interface OrderItem {
  name: string
  image: string
  quantity: number
  price: number
}

interface Order {
  id: string
  date: string
  items: OrderItem[]
  totalPrice: number
}

const orders: Order[] = [
  {
    id: 'OD20260715001',
    date: '2026-07-15',
    items: [
      { name: '耶加雪菲', image: '', quantity: 2, price: 380 },
      { name: 'V60 濾杯', image: '', quantity: 1, price: 450 },
    ],
    totalPrice: 1210,
  },
  {
    id: 'OD20260602001',
    date: '2026-06-02',
    items: [{ name: '曼特寧', image: '', quantity: 1, price: 340 }],
    totalPrice: 340,
  },
  {
    id: 'OD20260418002',
    date: '2026-04-18',
    items: [
      { name: '瑰夏厭氧', image: '', quantity: 1, price: 620 },
      { name: '手搖磨豆機', image: '', quantity: 1, price: 1200 },
      { name: '濾紙 100 入', image: '', quantity: 2, price: 150 },
    ],
    totalPrice: 2120,
  },
  {
    id: 'OD20260305001',
    date: '2026-03-05',
    items: [{ name: '巴西聖多斯', image: '', quantity: 3, price: 300 }],
    totalPrice: 900,
  },
  {
    id: 'OD20260112003',
    date: '2026-01-12',
    items: [
      { name: '電子秤', image: '', quantity: 1, price: 650 },
      { name: '手沖壺', image: '', quantity: 1, price: 890 },
    ],
    totalPrice: 1540,
  },
]

const sortedOrders = computed(() => [...orders].sort((a, b) => b.date.localeCompare(a.date)))

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

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return `${year}年${month}月${day}日`
}
</script>

<template>
  <div class="order-history">
    <h1 class="order-history__title">訂單紀錄</h1>

    <ul class="order-list">
      <li v-for="order in sortedOrders" :key="order.id" class="order-card">
        <div class="order-card__header">
          <span class="order-card__id">訂單編號：{{ order.id }}</span>
          <button type="button" class="order-card__toggle" @click="toggleExpand(order.id)">
            {{ isExpanded(order.id) ? '收合' : '展開' }}
            <span class="order-card__chevron" :class="{ 'order-card__chevron--open': isExpanded(order.id) }">▾</span>
          </button>
        </div>

        <ul class="order-card__items">
          <li
            v-for="item in (isExpanded(order.id) ? order.items : order.items.slice(0, 1))"
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
        <p v-if="!isExpanded(order.id) && order.items.length > 1" class="order-card__more">
          其餘 {{ order.items.length - 1 }} 項商品…
        </p>

        <div class="order-card__footer">
          <div class="order-card__summary">
            <span class="order-card__date">{{ formatDate(order.date) }}</span>
            <span class="order-card__total">總計 NT$ {{ order.totalPrice }}</span>
          </div>
          <RouterLink
            :to="{ name: RouteName.CONTACT, query: { orderId: order.id } }"
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
