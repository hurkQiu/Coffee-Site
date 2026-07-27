<script setup lang="ts">
import { RouteName } from '@/router/routeName'
</script>

<template>
  <div class="not-found">
    <p class="not-found__code">404</p>
    <h1 class="not-found__title">找不到這個頁面</h1>
    <p class="not-found__text">您要找的頁面不存在，可能已經被移除或網址有誤。</p>
    <RouterLink :to="{ name: RouteName.HOME }" class="not-found__link">回到首頁</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 100px 0;
  text-align: center;
}

.not-found__code {
  font-size: 3.5rem;
  font-weight: bold;
  color: var(--color-brand);
}

.not-found__title {
  font-size: 1.3rem;
  color: var(--color-heading);
}

.not-found__text {
  max-width: 360px;
  color: var(--color-text);
  opacity: 0.75;
}

.not-found__link {
  margin-top: 16px;
  padding: 10px 24px;
  border-radius: 999px;
  background: var(--color-brand);
  color: var(--color-on-brand);
  text-decoration: none;
}

.not-found__link:hover {
  background: var(--color-brand-dark);
}
</style>
