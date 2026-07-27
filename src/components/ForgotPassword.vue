<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/router/routeName'
import AuthCard from './AuthCard.vue'

const route = useRoute()
const router = useRouter()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')

function handleSubmit() {
  router.push({ name: RouteName.VERIFY_CODE, query: { email: email.value } })
}
</script>

<template>
  <AuthCard title="忘記密碼" subtitle="請輸入您的註冊信箱，我們將寄送驗證碼給您">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <label class="auth-form__field">
        帳號（信箱）
        <input v-model="email" type="email" required placeholder="you@example.com" />
      </label>
      <button type="submit" class="submit-btn">取得驗證碼</button>
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

.submit-btn:hover {
  background: var(--color-brand-dark);
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
