<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/router/routeName'
import { useAuth } from '@/stores/auth'
import AuthCard from './AuthCard.vue'

const route = useRoute()
const router = useRouter()
const { forgotPassword } = useAuth()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const error = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  error.value = ''
  const result = await forgotPassword(email.value)
  isSubmitting.value = false
  if (!result.ok) {
    error.value = result.message ?? '請稍後再試'
    return
  }
  router.push({ name: RouteName.VERIFY_CODE, query: { email: email.value, mode: 'reset', devCode: result.devCode } })
}
</script>

<template>
  <AuthCard title="忘記密碼" subtitle="請輸入您的註冊信箱，我們將寄送驗證碼給您">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <label class="auth-form__field">
        帳號（信箱）
        <input v-model="email" type="email" required placeholder="you@example.com" />
      </label>
      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? '傳送中...' : '取得驗證碼' }}
      </button>
      <p v-if="error" class="feedback feedback--error">{{ error }}</p>
    </form>
    <RouterLink :to="{ name: RouteName.MEMBER }" class="back-link">返回登入</RouterLink>
  </AuthCard>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--color-heading);
}

.auth-form__field input {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
}

.submit-btn {
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: var(--color-brand);
  color: var(--color-on-brand);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-brand-dark);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.feedback--error {
  margin-top: 4px;
  text-align: center;
  color: #d33;
  font-size: 0.85rem;
}

.back-link {
  display: block;
  margin-top: 16px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-brand);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
