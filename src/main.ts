import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.ts'
import { useBeans } from './stores/beans'
import { useUtensils } from './stores/utensils'
import { useCart } from './stores/cart'
import { useWishlist } from './stores/wishlist'

async function bootstrap() {
  const { load: loadBeans } = useBeans()
  const { load: loadUtensils } = useUtensils()
  const { load: loadCart } = useCart()
  const { load: loadWishlist } = useWishlist()

  await Promise.allSettled([loadBeans(), loadUtensils(), loadCart(), loadWishlist()])

  createApp(App).use(router).mount('#app')
}

bootstrap()
