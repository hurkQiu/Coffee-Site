<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/router/routeName'
import { useAuth } from '@/stores/auth'
import AuthCard from './AuthCard.vue'

type Tab = 'login' | 'register'

const router = useRouter()
const route = useRoute()
const { login, register } = useAuth()

const activeTab = ref<Tab>(route.query.tab === 'register' ? 'register' : 'login')

const loginEmail = ref('')
const loginPassword = ref('')
const loginMessage = ref('')
const loginError = ref('')
const isLoggingIn = ref(false)

const registerEmail = ref('')
const registerPassword = ref('')
const registerError = ref('')
const isRegistering = ref(false)

function switchTab(tab: Tab) {
  activeTab.value = tab
  loginMessage.value = ''
  loginError.value = ''
  registerError.value = ''
}

async function handleLogin() {
  if (isLoggingIn.value) return
  isLoggingIn.value = true
  loginError.value = ''
  const result = await login(loginEmail.value, loginPassword.value)
  isLoggingIn.value = false
  if (!result.ok) {
    loginError.value = result.message ?? '登入失敗'
    return
  }
  loginMessage.value = `已登入：${loginEmail.value}`
  router.push({ name: RouteName.HOME })
}

async function handleRegister() {
  if (isRegistering.value) return
  isRegistering.value = true
  registerError.value = ''
  const result = await register(registerEmail.value, registerPassword.value)
  isRegistering.value = false
  if (!result.ok) {
    registerError.value = result.message ?? '註冊失敗'
    return
  }
  router.push({
    name: RouteName.VERIFY_CODE,
    query: { email: registerEmail.value, mode: 'register', devCode: result.devCode },
  })
}
</script>

<template>
  <AuthCard :title="activeTab === 'login' ? '會員登入' : '會員註冊'">
    <div class="tabs">
      <button
        type="button"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'login' }"
        @click="switchTab('login')"
      >登入</button>
      <button
        type="button"
        class="tabs__item"
        :class="{ 'tabs__item--active': activeTab === 'register' }"
        @click="switchTab('register')"
      >註冊</button>
    </div>

    <form v-if="activeTab === 'login'" class="auth-form" @submit.prevent="handleLogin">
      <label class="auth-form__field">
        帳號（信箱）
        <input v-model="loginEmail" type="email" required placeholder="you@example.com" />
      </label>
      <label class="auth-form__field">
        密碼
        <input v-model="loginPassword" type="password" required placeholder="請輸入密碼" />
      </label>
      <RouterLink
        :to="{ name: RouteName.FORGOT_PASSWORD, query: { email: loginEmail } }"
        class="forgot-link"
      >忘記密碼？</RouterLink>
      <button type="submit" class="submit-btn" :disabled="isLoggingIn">{{ isLoggingIn ? '登入中...' : '登入' }}</button>
      <p v-if="loginMessage" class="feedback">{{ loginMessage }}</p>
      <p v-if="loginError" class="feedback feedback--error">{{ loginError }}</p>
      <p class="hint">測試帳號：admin@coffeehouse.example.com / admin123（管理員）</p>
    </form>

    <form v-else class="auth-form" @submit.prevent="handleRegister">
      <label class="auth-form__field">
        帳號（信箱）
        <input v-model="registerEmail" type="email" required placeholder="you@example.com" />
      </label>
      <label class="auth-form__field">
        密碼
        <input v-model="registerPassword" type="password" required minlength="6" placeholder="至少 6 碼" />
      </label>
      <button type="submit" class="submit-btn" :disabled="isRegistering">{{ isRegistering ? '註冊中...' : '註冊' }}</button>
      <p v-if="registerError" class="feedback feedback--error">{{ registerError }}</p>
    </form>
  </AuthCard>
</template>

<style scoped>
.tabs {
  display: flex;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.tabs__item {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  color: var(--color-text);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.tabs__item--active {
  color: var(--color-brand);
  border-bottom-color: var(--color-brand);
  font-weight: bold;
}

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

.forgot-link {
  align-self: flex-end;
  margin-top: -8px;
  font-size: 0.85rem;
  color: var(--color-brand);
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
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

.feedback {
  text-align: center;
  color: var(--color-brand);
  font-size: 0.9rem;
}

.feedback--error {
  color: #d33;
}

.hint {
  text-align: center;
  color: var(--color-text);
  opacity: 0.6;
  font-size: 0.8rem;
}
</style>
