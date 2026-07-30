<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api, ApiError } from '@/lib/api'
import { useAuth } from '@/stores/auth'

const route = useRoute()
const { isLoggedIn } = useAuth()

const orderId = ref(typeof route.query.orderId === 'string' ? route.query.orderId : '')
const title = ref('')
const content = ref('')
const submitted = ref(false)
const error = ref('')
const isSubmitting = ref(false)

watch(
  () => route.query.orderId,
  (value) => {
    if (typeof value === 'string') orderId.value = value
  },
)

async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  error.value = ''
  try {
    await api.post(
      '/contact',
      { orderId: orderId.value, title: title.value, content: content.value },
      { auth: isLoggedIn.value },
    )
    submitted.value = true
    title.value = ''
    content.value = ''
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : '送出失敗，請稍後再試'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="contact">
    <section class="contact-info">
      <div class="contact-info__item">
        <span class="contact-info__label">聯絡電話</span>
        <span class="contact-info__value">(02) 2345-6789</span>
      </div>
      <div class="contact-info__item">
        <span class="contact-info__label">聯絡信箱</span>
        <span class="contact-info__value">service@coffeehouse.example.com</span>
      </div>
      <div class="contact-info__item">
        <span class="contact-info__label">地址</span>
        <span class="contact-info__value">台北市中正區忠孝東路一段 1 號</span>
      </div>
    </section>

    <section class="contact-form-section">
      <h2 class="contact-form-section__title">聯絡客服</h2>
      <form class="contact-form" @submit.prevent="handleSubmit">
        <label class="contact-form__field">
          訂單號碼
          <input v-model="orderId" type="text" placeholder="若無相關訂單可留空" />
        </label>
        <label class="contact-form__field">
          標題
          <input v-model="title" type="text" required placeholder="請簡述您的問題" />
        </label>
        <label class="contact-form__field">
          內容
          <textarea v-model="content" required rows="5" placeholder="請詳細描述您遇到的狀況"></textarea>
        </label>
        <button type="submit" class="contact-form__submit" :disabled="isSubmitting">
          {{ isSubmitting ? '送出中...' : '送出' }}
        </button>
        <p v-if="submitted" class="contact-form__feedback">已送出，客服將盡快與您聯繫！</p>
        <p v-if="error" class="contact-form__error">{{ error }}</p>
      </form>
    </section>
  </div>
</template>

<style scoped>
.contact {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 560px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-background-soft);
}

.contact-info__item {
  display: flex;
  gap: 12px;
}

.contact-info__label {
  flex: 0 0 80px;
  color: var(--color-heading);
  font-weight: bold;
}

.contact-info__value {
  color: var(--color-text);
}

.contact-form-section__title {
  margin-bottom: 16px;
  font-size: 1.2rem;
  color: var(--color-heading);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--color-heading);
}

.contact-form__field input,
.contact-form__field textarea {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
}

.contact-form__submit {
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: var(--color-brand);
  color: var(--color-on-brand);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.contact-form__submit:hover:not(:disabled) {
  background: var(--color-brand-dark);
}

.contact-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact-form__feedback {
  text-align: center;
  color: hsla(160, 100%, 30%, 1);
  font-weight: bold;
}

.contact-form__error {
  text-align: center;
  color: #d33;
}
</style>
