<script setup lang="ts">
import { ref } from 'vue'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { simulateDelay } from '@/utils/async'

interface SelectField {
  key: string
  label: string
  options: string[]
  initialValue: string
}

const props = defineProps<{
  title: string
  initialName?: string
  initialImage?: string
  initialPrice?: number
  initialStock?: number
  selectFields?: SelectField[]
}>()

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      name: string
      image: string
      price: number
      stock: number
      selections: Record<string, string>
    },
  ): void
  (e: 'cancel'): void
}>()

const name = ref(props.initialName ?? '')
const image = ref(props.initialImage ?? '')
const price = ref(props.initialPrice ?? 0)
const stock = ref(props.initialStock ?? 0)

const selections = ref<Record<string, string>>(
  Object.fromEntries((props.selectFields ?? []).map((field) => [field.key, field.initialValue])),
)

const modalRef = ref<HTMLElement | null>(null)
useFocusTrap(modalRef, () => emit('cancel'))

const saving = ref(false)

async function handleSubmit() {
  if (saving.value) return
  saving.value = true
  await simulateDelay(500)
  emit('submit', {
    name: name.value.trim(),
    image: image.value.trim(),
    price: Number(price.value),
    stock: Number(stock.value),
    selections: { ...selections.value },
  })
  saving.value = false
}
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('cancel')">
    <div ref="modalRef" class="modal" role="dialog" aria-modal="true" aria-labelledby="product-form-modal-title">
      <h2 id="product-form-modal-title" class="modal__title">{{ title }}</h2>
      <form class="modal-form" @submit.prevent="handleSubmit">
        <label class="modal-form__field">
          商品名稱
          <input v-model="name" type="text" required placeholder="請輸入商品名稱" />
        </label>
        <label class="modal-form__field">
          圖片網址
          <input v-model="image" type="text" placeholder="留空使用預設圖示" />
        </label>
        <label v-for="field in selectFields" :key="field.key" class="modal-form__field">
          {{ field.label }}
          <select v-model="selections[field.key]">
            <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
          </select>
        </label>
        <label class="modal-form__field">
          價格
          <input v-model.number="price" type="number" min="0" required placeholder="請輸入價格" />
        </label>
        <label class="modal-form__field">
          剩餘數量
          <input v-model.number="stock" type="number" min="0" required placeholder="請輸入庫存數量" />
        </label>
        <div class="modal-form__actions">
          <button type="button" class="modal-form__cancel" :disabled="saving" @click="emit('cancel')">取消</button>
          <button type="submit" class="modal-form__submit" :disabled="saving">{{ saving ? '儲存中...' : '儲存' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
}

.modal {
  width: 100%;
  max-width: 380px;
  padding: 24px;
  border-radius: 12px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.modal__title {
  margin-bottom: 16px;
  font-size: 1.2rem;
  color: var(--color-heading);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--color-heading);
}

.modal-form__field input,
.modal-form__field select {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  font-family: inherit;
}

.modal-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.modal-form__cancel,
.modal-form__submit {
  padding: 8px 18px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
  cursor: pointer;
}

.modal-form__cancel {
  background: var(--color-background);
  color: var(--color-text);
}

.modal-form__submit {
  background: var(--color-brand);
  border-color: var(--color-brand);
  color: var(--color-on-brand);
}

.modal-form__submit:hover:not(:disabled) {
  background: var(--color-brand-dark);
}

.modal-form__cancel:disabled,
.modal-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
