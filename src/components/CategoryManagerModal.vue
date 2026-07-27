<script setup lang="ts">
import { ref } from 'vue'
import { useFocusTrap } from '@/composables/useFocusTrap'

interface CategoryItem {
  value: string
  hidden: boolean
}

interface CategoryGroup {
  key: string
  title: string
  items: CategoryItem[]
}

const props = defineProps<{
  groups: CategoryGroup[]
}>()

const emit = defineEmits<{
  (e: 'add', payload: { groupKey: string; value: string }): void
  (e: 'toggle', payload: { groupKey: string; value: string }): void
  (e: 'close'): void
}>()

const inputs = ref<Record<string, string>>(
  Object.fromEntries(props.groups.map((group) => [group.key, ''])),
)

const modalRef = ref<HTMLElement | null>(null)
useFocusTrap(modalRef, () => emit('close'))

function handleAdd(groupKey: string) {
  const value = (inputs.value[groupKey] ?? '').trim()
  if (!value) return
  emit('add', { groupKey, value })
  inputs.value[groupKey] = ''
}

function handleToggle(groupKey: string, value: string) {
  emit('toggle', { groupKey, value })
}

function visibleCount(group: CategoryGroup) {
  return group.items.filter((item) => !item.hidden).length
}

function isToggleDisabled(group: CategoryGroup, item: CategoryItem) {
  return !item.hidden && visibleCount(group) <= 1
}
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div ref="modalRef" class="modal" role="dialog" aria-modal="true" aria-labelledby="category-manager-modal-title">
      <h2 id="category-manager-modal-title" class="modal__title">類別管理</h2>

      <div v-for="group in groups" :key="group.key" class="category-group">
        <h3 class="category-group__title">{{ group.title }}</h3>
        <ul class="category-group__list">
          <li
            v-for="item in group.items"
            :key="item.value"
            class="category-group__item"
            :class="{ 'category-group__item--hidden': item.hidden }"
          >
            <span>{{ item.value }}</span>
            <button
              type="button"
              class="category-group__toggle"
              :class="{ 'category-group__toggle--hidden': item.hidden }"
              :disabled="isToggleDisabled(group, item)"
              :title="isToggleDisabled(group, item) ? '至少須保留一個顯示項目' : (item.hidden ? '顯示於頁面' : '隱藏於頁面')"
              @click="handleToggle(group.key, item.value)"
            >{{ item.hidden ? '顯示' : '隱藏' }}</button>
          </li>
        </ul>
        <div class="category-group__add">
          <input
            v-model="inputs[group.key]"
            type="text"
            :placeholder="`新增${group.title}`"
            @keyup.enter="handleAdd(group.key)"
          />
          <button type="button" @click="handleAdd(group.key)">新增</button>
        </div>
      </div>

      <div class="modal-form__actions">
        <button type="button" class="modal-form__cancel" @click="emit('close')">關閉</button>
      </div>
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
  max-width: 420px;
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

.category-group {
  margin-bottom: 20px;
}

.category-group__title {
  margin-bottom: 8px;
  font-size: 0.95rem;
  color: var(--color-heading);
}

.category-group__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 10px;
  padding: 0;
  list-style: none;
}

.category-group__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px 4px 12px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
}

.category-group__item--hidden {
  opacity: 0.5;
}

.category-group__item--hidden span {
  text-decoration: line-through;
}

.category-group__toggle {
  padding: 3px 10px;
  border: none;
  border-radius: 999px;
  background: var(--color-brand);
  color: #fff;
  font-size: 0.8rem;
  line-height: 1.4;
  cursor: pointer;
  white-space: nowrap;
}

.category-group__toggle--hidden {
  background: var(--color-background-mute);
  color: #9a9a9a;
}

.category-group__toggle:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.category-group__add {
  display: flex;
  gap: 8px;
}

.category-group__add input {
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
}

.category-group__add button {
  padding: 8px 14px;
  border: 1px solid var(--color-brand);
  border-radius: 6px;
  background: var(--color-brand);
  color: var(--color-on-brand);
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
}

.modal-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.modal-form__cancel {
  padding: 8px 18px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.95rem;
  cursor: pointer;
}
</style>
