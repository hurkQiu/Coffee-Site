<script setup lang="ts">
import { ref } from 'vue'
import { useFocusTrap } from '@/composables/useFocusTrap'

defineProps<{
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
useFocusTrap(modalRef, () => emit('cancel'))
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('cancel')">
    <div
      ref="modalRef"
      class="modal"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <h2 id="confirm-dialog-title" class="modal__title">{{ title }}</h2>
      <p class="modal__message">{{ message }}</p>
      <div class="modal__actions">
        <button type="button" class="modal__cancel" @click="emit('cancel')">{{ cancelLabel ?? '取消' }}</button>
        <button type="button" class="modal__confirm" @click="emit('confirm')">{{ confirmLabel ?? '確定' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 210;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
}

.modal {
  width: 100%;
  max-width: 340px;
  padding: 24px;
  border-radius: 12px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.modal__title {
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: var(--color-heading);
}

.modal__message {
  margin-bottom: 20px;
  color: var(--color-text);
  line-height: 1.6;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal__cancel,
.modal__confirm {
  padding: 8px 18px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
  cursor: pointer;
}

.modal__cancel {
  background: var(--color-background);
  color: var(--color-text);
}

.modal__confirm {
  background: #b04a4a;
  border-color: #b04a4a;
  color: #fff;
}

.modal__confirm:hover {
  background: #963d3d;
}
</style>
