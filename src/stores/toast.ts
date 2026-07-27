import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

let uid = 0
const toasts = reactive<ToastMessage[]>([])

function dismissToast(id: number) {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

function showToast(message: string, type: ToastType = 'info') {
  const id = ++uid
  toasts.push({ id, message, type })
  setTimeout(() => dismissToast(id), 3000)
}

export function useToast() {
  return { toasts, showToast, dismissToast }
}
