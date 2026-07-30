import { computed, ref, watch } from 'vue'
import { api, ApiError, setAuthToken } from '@/lib/api'

export type Permission = 'admin' | 'member'

const STORAGE_KEY = 'coffee-site:auth'

interface PersistedAuth {
  isLoggedIn: boolean
  token: string | null
  permission: Permission | null
  email: string | null
}

function loadAuth(): PersistedAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as PersistedAuth
  } catch {
    // ignore parse errors, fall back to defaults
  }
  return { isLoggedIn: false, token: null, permission: null, email: null }
}

const initialAuth = loadAuth()

const isLoggedIn = ref(initialAuth.isLoggedIn)
const token = ref<string | null>(initialAuth.token)
const permission = ref<Permission | null>(initialAuth.permission)
const email = ref<string | null>(initialAuth.email)

setAuthToken(token.value)

watch([isLoggedIn, token, permission, email], () => {
  setAuthToken(token.value)
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        isLoggedIn: isLoggedIn.value,
        token: token.value,
        permission: permission.value,
        email: email.value,
      } satisfies PersistedAuth),
    )
  } catch {
    // ignore write errors (private browsing quota, etc.)
  }
})

const isAdmin = computed(() => isLoggedIn.value && permission.value === 'admin')

interface AuthResult {
  ok: boolean
  message?: string
  devCode?: string
}

async function register(userEmail: string, password: string): Promise<AuthResult> {
  try {
    const res = await api.post<{ message: string; devCode?: string }>('/auth/register', {
      email: userEmail,
      password,
    })
    return { ok: true, message: res.message, devCode: res.devCode }
  } catch (err) {
    return { ok: false, message: err instanceof ApiError ? err.message : '註冊失敗，請稍後再試' }
  }
}

async function verifyRegisterCode(userEmail: string, code: string): Promise<AuthResult> {
  try {
    const res = await api.post<{ message: string }>('/auth/verify-register', { email: userEmail, code })
    return { ok: true, message: res.message }
  } catch (err) {
    return { ok: false, message: err instanceof ApiError ? err.message : '驗證失敗，請稍後再試' }
  }
}

async function login(userEmail: string, password: string): Promise<AuthResult> {
  try {
    const res = await api.post<{ token: string; email: string; permission: Permission }>('/auth/login', {
      email: userEmail,
      password,
    })
    isLoggedIn.value = true
    token.value = res.token
    permission.value = res.permission
    email.value = res.email
    return { ok: true }
  } catch (err) {
    return { ok: false, message: err instanceof ApiError ? err.message : '登入失敗，請稍後再試' }
  }
}

function logout() {
  isLoggedIn.value = false
  token.value = null
  permission.value = null
  email.value = null
}

async function forgotPassword(userEmail: string): Promise<AuthResult> {
  try {
    const res = await api.post<{ message: string; devCode?: string }>('/auth/forgot-password', { email: userEmail })
    return { ok: true, message: res.message, devCode: res.devCode }
  } catch (err) {
    return { ok: false, message: err instanceof ApiError ? err.message : '請稍後再試' }
  }
}

async function verifyResetCode(userEmail: string, code: string): Promise<AuthResult> {
  try {
    await api.post<{ valid: boolean }>('/auth/verify-reset-code', { email: userEmail, code })
    return { ok: true }
  } catch (err) {
    return { ok: false, message: err instanceof ApiError ? err.message : '驗證碼錯誤' }
  }
}

async function resetPassword(userEmail: string, code: string, newPassword: string): Promise<AuthResult> {
  try {
    const res = await api.post<{ message: string }>('/auth/reset-password', {
      email: userEmail,
      code,
      newPassword,
    })
    return { ok: true, message: res.message }
  } catch (err) {
    return { ok: false, message: err instanceof ApiError ? err.message : '重設密碼失敗' }
  }
}

async function verifyAdminPermission(): Promise<boolean> {
  if (!isLoggedIn.value || !token.value) return false
  try {
    const res = await api.post<{ authorized: boolean }>('/auth/verify-permission', undefined, { auth: true })
    if (!res.authorized) logout()
    return res.authorized
  } catch {
    logout()
    return false
  }
}

export function useAuth() {
  return {
    isLoggedIn,
    token,
    permission,
    email,
    isAdmin,
    register,
    verifyRegisterCode,
    login,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    verifyAdminPermission,
  }
}
