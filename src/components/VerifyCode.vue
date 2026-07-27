<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/router/routeName'
import AuthCard from './AuthCard.vue'

const route = useRoute()
const router = useRouter()

const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))
const code = ref('')
const verified = ref(false)

function handleSubmit() {
  verified.value = true
}

function goToLogin() {
  router.push({ name: RouteName.MEMBER })
}
</script>

<template>
  <AuthCard
    title="輸入驗證碼"
    :subtitle="email ? `驗證碼已寄送至 ${email}` : '請輸入您收到的驗證碼'"
  >
    <form v-if="!verified" class="auth-form" @submit.prevent="handleSubmit">
      <label class="auth-form__field">
        驗證碼
        <input v-model="code" type="text" required placeholder="請輸入 6 位數驗證碼" maxlength="6" />
      </label>
      <button type="submit" class="submit-btn">驗證</button>
    </form>
    <div v-else class="verified">
      <p class="feedback">驗證成功！</p>
      <button type="button" class="submit-btn" @click="goToLogin">前往登入</button>
    </div>
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
  letter-spacing: 0.2em;
  text-align: center;
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

.verified {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.feedback {
  color: hsla(160, 100%, 30%, 1);
  font-weight: bold;
}
</style>
