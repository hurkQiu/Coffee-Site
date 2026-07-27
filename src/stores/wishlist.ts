import { persistedSetRef } from '@/utils/persist'

const wishlistIds = persistedSetRef('coffee-site:wishlist')

function isWishlisted(id: string) {
  return wishlistIds.value.has(id)
}

function toggleWishlist(id: string) {
  const next = new Set(wishlistIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  wishlistIds.value = next
}

export function useWishlist() {
  return { wishlistIds, isWishlisted, toggleWishlist }
}
