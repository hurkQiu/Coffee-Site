<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/router/routeName'
import { useAuth } from '@/stores/auth'
import AuthCard from './AuthCard.vue'

type Tab = 'login' | 'register'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const activeTab = ref<Tab>(route.query.tab === 'register' ? 'register' : 'login')

const loginEmail = ref('')
const loginPassword = ref('')
const loginMessage = ref('')

const registerEmail = ref('')
const registerPassword = ref('')

function switchTab(tab: Tab) {
  activeTab.value = tab
  loginMessage.value = ''
}

function handleLogin() {
  login()
  loginMessage.value = `已登入：${loginEmail.value}`
  router.push({ name: RouteName.HOME })
}

function handleRegister() {
  router.push({ name: RouteName.VERIFY_CODE, query: { email: registerEmail.value } })
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
      <button type="submit" class="submit-btn">登入</button>
      <p v-if="loginMessage" class="feedback">{{ loginMessage }}</p>
    </form>

    <form v-else class="auth-form" @submit.prevent="handleRegister">
      <label class="auth-form__field">
        帳號（信箱）
        <input v-model="registerEmail" type="email" required placeholder="you@example.com" />
      </label>
      <label class="auth-form__field">
        密碼
        <input v-model="registerPassword" type="password" required placeholder="設定密碼" />
      </label>
      <button type="submit" class="submit-btn">註冊</button>
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

.submit-btn:hover {
  background: var(--color-brand-dark);
}

.feedback {
  text-align: center;
  color: var(--color-brand);
  font-size: 0.9rem;
}
</style>
