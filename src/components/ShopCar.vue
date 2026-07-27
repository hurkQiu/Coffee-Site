<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCart } from '@/stores/cart'
import { useToast } from '@/stores/toast'
import { simulateDelay } from '@/utils/async'
import { RouteName } from '@/router/routeName'
import IconCart from './icons/IconCart.vue'
import IconImagePlaceholder from './icons/IconImagePlaceholder.vue'

const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart()
const { showToast } = useToast()

const COUPONS: Record<string, number> = {
  COFFEE10: 0.1,
  WELCOME50: 0.05,
}

const couponInput = ref('')
const appliedCoupon = ref<{ code: string; rate: number } | null>(null)
const couponError = ref('')
const isApplyingCoupon = ref(false)
const isCheckingOut = ref(false)
const orderPlaced = ref(false)

const subtotal = computed(() => totalPrice.value)
const shippingFee = computed(() => (subtotal.value >= 1000 || subtotal.value === 0 ? 0 : 60))
const discount = computed(() =>
  appliedCoupon.value ? Math.round(subtotal.value * appliedCoupon.value.rate) : 0,
)
const total = computed(() => subtotal.value + shippingFee.value - discount.value)

async function applyCoupon() {
  if (isApplyingCoupon.value) return
  isApplyingCoupon.value = true
  await simulateDelay(400)

  const code = couponInput.value.trim().toUpperCase()
  const rate = COUPONS[code]
  if (!rate) {
    couponError.value = '優惠券代碼無效'
    appliedCoupon.value = null
    showToast('優惠券代碼無效', 'error')
  } else {
    appliedCoupon.value = { code, rate }
    couponError.value = ''
    showToast(`已套用優惠券「${code}」`, 'success')
  }
  isApplyingCoupon.value = false
}

function removeCoupon() {
  appliedCoupon.value = null
  couponInput.value = ''
  couponError.value = ''
}

async function checkout() {
  if (isCheckingOut.value) return
  isCheckingOut.value = true
  await simulateDelay(800)
  console.log('前往結帳', { items: [...items], total: total.value })
  isCheckingOut.value = false
  orderPlaced.value = true
  clearCart()
  showToast('訂單已送出（僅為示範，未串接實際金流）', 'success')
}
</script>

<template>
  <div class="shop-car">
    <div v-if="orderPlaced" class="order-success">
      <p class="order-success__emoji">🎉</p>
      <p class="order-success__text">訂單已送出！感謝您的購買。</p>
      <RouterLink :to="{ name: RouteName.COFFEE_BEANS }" class="order-success__link">繼續選購</RouterLink>
    </div>

    <div v-else-if="items.length === 0" class="empty-cart">
      <IconCart class="empty-cart__icon" />
      <p class="empty-cart__text">購物車是空的</p>
    </div>

    <div v-else class="cart-content">
      <ul class="cart-list">
        <li v-for="item in items" :key="item.id" class="cart-row">
          <div class="cart-row__image">
            <img v-if="item.image" :src="item.image" :alt="item.name" />
            <IconImagePlaceholder v-else class="cart-row__image-placeholder" />
          </div>
          <span class="cart-row__name">{{ item.name }}</span>
          <div class="cart-row__quantity">
            <button type="button" aria-label="減少數量" @click="updateQuantity(item.id, item.quantity - 1)">-</button>
            <span>{{ item.quantity }}</span>
            <button type="button" aria-label="增加數量" @click="updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <span class="cart-row__price">NT$ {{ item.price * item.quantity }}</span>
          <button type="button" class="cart-row__remove" aria-label="移除" @click="removeItem(item.id)">×</button>
        </li>
      </ul>

      <div class="summary">
        <div class="summary__row">
          <span>商品小計</span>
          <span>NT$ {{ subtotal }}</span>
        </div>
        <div class="summary__row">
          <span>運費</span>
          <span>{{ shippingFee === 0 ? '免運' : `NT$ ${shippingFee}` }}</span>
        </div>

        <div class="summary__coupon">
          <div v-if="appliedCoupon" class="summary__coupon-applied">
            <span>已套用優惠券「{{ appliedCoupon.code }}」</span>
            <button type="button" @click="removeCoupon">移除</button>
          </div>
          <div v-else class="summary__coupon-form">
            <input
              v-model="couponInput"
              type="text"
              placeholder="輸入優惠券代碼"
              :disabled="isApplyingCoupon"
              @keyup.enter="applyCoupon"
            />
            <button type="button" :disabled="isApplyingCoupon" @click="applyCoupon">
              {{ isApplyingCoupon ? '套用中...' : '套用' }}
            </button>
          </div>
          <p v-if="couponError" class="summary__coupon-error">{{ couponError }}</p>
        </div>

        <div v-if="appliedCoupon" class="summary__row summary__row--discount">
          <span>折扣</span>
          <span>- NT$ {{ discount }}</span>
        </div>

        <div class="summary__row summary__row--total">
          <span>總計</span>
          <span>NT$ {{ total }}</span>
        </div>

        <button type="button" class="summary__checkout" :disabled="isCheckingOut" @click="checkout">
          {{ isCheckingOut ? '處理中...' : '前往結帳' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-car {
  width: 100%;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--color-text);
}

.empty-cart__icon {
  width: 64px;
  height: 64px;
  opacity: 0.5;
}

.empty-cart__text {
  font-size: 1.1rem;
}

.order-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 0;
  color: var(--color-text);
  text-align: center;
}

.order-success__emoji {
  font-size: 3rem;
}

.order-success__text {
  font-size: 1.1rem;
}

.order-success__link {
  margin-top: 8px;
  padding: 10px 24px;
  border-radius: 999px;
  background: var(--color-brand);
  color: var(--color-on-brand);
  text-decoration: none;
}

.order-success__link:hover {
  background: var(--color-brand-dark);
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cart-row {
  display: grid;
  grid-template-columns: 64px 1fr auto auto auto;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background-soft);
}

.cart-row__image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-background-mute);
}

.cart-row__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-row__image-placeholder {
  width: 40%;
  height: 40%;
  color: var(--color-border-hover);
}

.cart-row__name {
  color: var(--color-heading);
}

.cart-row__quantity {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cart-row__quantity button {
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
}

.cart-row__price {
  font-weight: bold;
  white-space: nowrap;
}

.cart-row__remove {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 1.1rem;
  cursor: pointer;
}

.summary {
  align-self: flex-end;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background-soft);
}

.summary__row {
  display: flex;
  justify-content: space-between;
}

.summary__row--discount {
  color: hsla(160, 100%, 37%, 1);
}

.summary__row--total {
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
  font-size: 1.2rem;
  font-weight: bold;
}

.summary__coupon {
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.summary__coupon-form {
  display: flex;
  gap: 8px;
}

.summary__coupon-form input {
  flex: 1;
  min-width: 0;
  padding: 6px 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
}

.summary__coupon-form button,
.summary__coupon-applied button {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  white-space: nowrap;
}

.summary__coupon-applied {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary__coupon-error {
  margin-top: 6px;
  color: #d33;
  font-size: 0.85rem;
}

.summary__checkout {
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: hsla(160, 100%, 37%, 1);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.summary__checkout:hover:not(:disabled) {
  background: hsla(160, 100%, 32%, 1);
}

.summary__checkout:disabled,
.summary__coupon-form button:disabled,
.summary__coupon-form input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .cart-row {
    grid-template-columns: 48px 1fr;
    grid-template-areas:
      'image name'
      'image quantity'
      'image price'
      'image remove';
  }

  .cart-row__image {
    grid-area: image;
    width: 48px;
    height: 48px;
  }

  .cart-row__name {
    grid-area: name;
  }

  .cart-row__quantity {
    grid-area: quantity;
  }

  .cart-row__price {
    grid-area: price;
  }

  .cart-row__remove {
    grid-area: remove;
    justify-self: start;
  }
}
</style>
