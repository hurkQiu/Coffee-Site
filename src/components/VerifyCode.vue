<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/router/routeName'
import { useAuth } from '@/stores/auth'
import AuthCard from './AuthCard.vue'

const route = useRoute()
const router = useRouter()
const { verifyRegisterCode, verifyResetCode, resetPassword } = useAuth()

const email = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))
const mode = computed(() => (route.query.mode === 'register' ? 'register' : 'reset'))
const devCode = computed(() => (typeof route.query.devCode === 'string' ? route.query.devCode : ''))

const code = ref('')
const verified = ref(false)
const error = ref('')
const isSubmitting = ref(false)

const newPassword = ref('')
const confirmPassword = ref('')
const resetDone = ref(false)
const resetError = ref('')
const isResetting = ref(false)

async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  error.value = ''

  const result =
    mode.value === 'register'
      ? await verifyRegisterCode(email.value, code.value)
      : await verifyResetCode(email.value, code.value)

  isSubmitting.value = false
  if (!result.ok) {
    error.value = result.message ?? '驗證碼錯誤'
    return
  }
  verified.value = true
}

async function handleResetSubmit() {
  if (isResetting.value) return
  resetError.value = ''
  if (newPassword.value.length < 6) {
    resetError.value = '密碼至少需要 6 碼'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    resetError.value = '兩次輸入的密碼不一致'
    return
  }

  isResetting.value = true
  const result = await resetPassword(email.value, code.value, newPassword.value)
  isResetting.value = false
  if (!result.ok) {
    resetError.value = result.message ?? '重設密碼失敗'
    return
  }
  resetDone.value = true
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
    <p v-if="devCode" class="dev-hint">開發模式：驗證碼為 {{ devCode }}（正式環境將以 Email 寄送）</p>

    <form v-if="!verified" class="auth-form" @submit.prevent="handleSubmit">
      <label class="auth-form__field">
        驗證碼
        <input v-model="code" type="text" required placeholder="請輸入 6 位數驗證碼" maxlength="6" />
      </label>
      <button type="submit" class="submit-btn" :disabled="isSubmitting">{{ isSubmitting ? '驗證中...' : '驗證' }}</button>
      <p v-if="error" class="feedback feedback--error">{{ error }}</p>
    </form>

    <div v-else-if="mode === 'register'" class="verified">
      <p class="feedback">驗證成功！帳號已啟用</p>
      <button type="button" class="submit-btn" @click="goToLogin">前往登入</button>
    </div>

    <div v-else-if="!resetDone" class="verified">
      <p class="feedback">驗證成功，請設定新密碼</p>
      <form class="auth-form" @submit.prevent="handleResetSubmit">
        <label class="auth-form__field">
          新密碼
          <input v-model="newPassword" type="password" required minlength="6" placeholder="至少 6 碼" />
        </label>
        <label class="auth-form__field">
          確認新密碼
          <input v-model="confirmPassword" type="password" required minlength="6" placeholder="請再輸入一次" />
        </label>
        <button type="submit" class="submit-btn" :disabled="isResetting">
          {{ isResetting ? '設定中...' : '設定新密碼' }}
        </button>
        <p v-if="resetError" class="feedback feedback--error">{{ resetError }}</p>
      </form>
    </div>

    <div v-else class="verified">
      <p class="feedback">密碼已重設！</p>
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

.dev-hint {
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 6px;
  background: hsla(45, 100%, 50%, 0.15);
  color: var(--color-heading);
  font-size: 0.85rem;
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

.submit-btn:hover:not(:disabled) {
  background: var(--color-brand-dark);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.feedback--error {
  color: #d33;
  font-weight: normal;
  font-size: 0.85rem;
}
</style>
