<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-card__title">{{ title }}</h1>
      <p v-if="subtitle" class="auth-card__subtitle">{{ subtitle }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-soft);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.auth-card__title {
  margin-bottom: 8px;
  font-size: 1.4rem;
  color: var(--color-heading);
  text-align: center;
}

.auth-card__subtitle {
  margin-bottom: 24px;
  color: var(--color-text);
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>
