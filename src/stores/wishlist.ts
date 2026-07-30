import { ref } from 'vue'
import { api } from '@/lib/api'

const wishlistIds = ref<Set<string>>(new Set())
let loaded = false

async function load(force = false) {
  if (loaded && !force) return
  const ids = await api.get<string[]>('/wishlist', { guest: true })
  wishlistIds.value = new Set(ids)
  loaded = true
}

function isWishlisted(id: string) {
  return wishlistIds.value.has(id)
}

function toggleWishlist(id: string) {
  const next = new Set(wishlistIds.value)
  const wasWishlisted = next.has(id)
  if (wasWishlisted) next.delete(id)
  else next.add(id)
  wishlistIds.value = next

  api
    .post<{ wishlisted: boolean }>(`/wishlist/${encodeURIComponent(id)}/toggle`, undefined, { guest: true })
    .catch(() => {
      const reverted = new Set(wishlistIds.value)
      if (wasWishlisted) reverted.add(id)
      else reverted.delete(id)
      wishlistIds.value = reverted
    })
}

export function useWishlist() {
  return { wishlistIds, load, isWishlisted, toggleWishlist }
}
