<script setup lang="ts">
import { useToast } from '@/stores/toast'

const { toasts, dismissToast } = useToast()
</script>

<template>
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast">
      <button
        v-for="toast in toasts"
        :key="toast.id"
        type="button"
        class="toast"
        :class="`toast--${toast.type}`"
        @click="dismissToast(toast.id)"
      >
        {{ toast.message }}
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 300;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 320px;
}

.toast {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: var(--color-brand-dark);
  color: var(--color-on-brand);
  font-size: 0.9rem;
  text-align: left;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.toast--success {
  background: hsla(160, 100%, 30%, 1);
}

.toast--error {
  background: #b04a4a;
}

.toast--info {
  background: var(--color-brand-dark);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
