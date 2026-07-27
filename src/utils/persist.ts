import { ref, watch, type Ref } from 'vue'

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore write errors (private browsing quota, etc.)
  }
}

export function persistedRef<T>(key: string, fallback: T): Ref<T> {
  const state = ref<T>(readStorage(key, fallback)) as Ref<T>
  watch(state, (value) => writeStorage(key, value), { deep: true })
  return state
}

export function persistedSetRef(key: string, fallback: string[] = []): Ref<Set<string>> {
  const state = ref(new Set(readStorage(key, fallback))) as Ref<Set<string>>
  watch(state, (value) => writeStorage(key, Array.from(value)), { deep: true })
  return state
}
