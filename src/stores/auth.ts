import { ref } from 'vue'
const isLoggedIn = ref(false)

function login() {
  isLoggedIn.value = true
}

function logout() {
  console.log('[API] POST /logout — 已送出登出通訊')
  isLoggedIn.value = false
}

export function useAuth() {
  return {
    isLoggedIn,
    login,
    logout,
  }
}
