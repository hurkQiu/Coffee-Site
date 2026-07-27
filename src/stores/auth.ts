import { computed, ref, watch } from 'vue'

export type Permission = 'admin' | 'member'

const STORAGE_KEY = 'coffee-site:auth'

interface PersistedAuth {
  isLoggedIn: boolean
  token: string | null
  permission: Permission | null
  testMode: boolean
}

function loadAuth(): PersistedAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as PersistedAuth
  } catch {
    // ignore parse errors, fall back to defaults
  }
  return { isLoggedIn: false, token: null, permission: null, testMode: false }
}

const initialAuth = loadAuth()

const isLoggedIn = ref(initialAuth.isLoggedIn)
const token = ref<string | null>(initialAuth.token)
const permission = ref<Permission | null>(initialAuth.permission)
const testMode = ref(initialAuth.testMode)

watch([isLoggedIn, token, permission, testMode], () => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        isLoggedIn: isLoggedIn.value,
        token: token.value,
        permission: permission.value,
        testMode: testMode.value,
      } satisfies PersistedAuth),
    )
  } catch {
    // ignore write errors (private browsing quota, etc.)
  }
})

const isAdmin = computed(() => isLoggedIn.value && permission.value === 'admin')
// 測試模式：忽略權限即可操作管理介面，但實際新增／編輯／刪除動作仍會被擋下
const canManage = computed(() => isAdmin.value || testMode.value)

function toggleTestMode() {
  testMode.value = !testMode.value
}

function login(email: string) {
  // 模擬後端登入回傳資料（token + 權限），實際串接時改為呼叫登入 API
  const mockPermission: Permission = email.trim().toLowerCase().includes('admin') ? 'admin' : 'member'
  const mockToken = `mock-token-${Math.random().toString(36).slice(2)}`

  isLoggedIn.value = true
  token.value = mockToken
  permission.value = mockPermission
}

function logout() {
  console.log('[API] POST /logout — 已送出登出通訊')
  isLoggedIn.value = false
  token.value = null
  permission.value = null
}

function verifyAdminPermission(): boolean {
  // 模擬將 token 送給後端檢查是否有權限，暫時忽略實際傳送資料
  console.log('[API] POST /verifyPermission', { token: token.value })
  const authorized = isAdmin.value
  if (!authorized) {
    logout()
  }
  return authorized
}

export function useAuth() {
  return {
    isLoggedIn,
    token,
    permission,
    isAdmin,
    testMode,
    canManage,
    toggleTestMode,
    login,
    logout,
    verifyAdminPermission,
  }
}
