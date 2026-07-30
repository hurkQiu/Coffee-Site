<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ShopItem from './ShopItem.vue'
import ProductFormModal from './ProductFormModal.vue'
import CategoryManagerModal from './CategoryManagerModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import { useCart } from '@/stores/cart'
import { useAuth } from '@/stores/auth'
import { useUtensils, type CoffeeUtensilItem } from '@/stores/utensils'
import { useToast } from '@/stores/toast'
import { ApiError } from '@/lib/api'

const { addItem } = useCart()
const { isAdmin, verifyAdminPermission } = useAuth()
const { showToast } = useToast()
const route = useRoute()

const {
  utensils,
  categories,
  visibleCategories,
  addUtensil,
  updateUtensil,
  removeUtensil,
  addCategory,
  toggleCategoryHidden,
  hiddenCategories,
} = useUtensils()

function isUtensilCategory(value: unknown): value is string {
  return typeof value === 'string' && visibleCategories.value.includes(value)
}

const selectedCategory = ref<string | null>(
  isUtensilCategory(route.query.category) ? route.query.category : null,
)

watch(
  () => route.query.category,
  (value) => {
    selectedCategory.value = isUtensilCategory(value) ? value : null
  },
)

function toggleCategory(category: string) {
  selectedCategory.value = selectedCategory.value === category ? null : category
}

const searchQuery = ref('')
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name'
const sortOption = ref<SortOption>('default')

const filteredUtensils = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  const list = utensils.value.filter(
    (item) =>
      (!selectedCategory.value || item.category === selectedCategory.value) &&
      (!keyword || item.name.toLowerCase().includes(keyword)),
  )
  const sorted = [...list]
  if (sortOption.value === 'price-asc') sorted.sort((a, b) => a.price - b.price)
  else if (sortOption.value === 'price-desc') sorted.sort((a, b) => b.price - a.price)
  else if (sortOption.value === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
  return sorted
})

function handleAddToCart(payload: { id: string; quantity: number }) {
  const utensil = utensils.value.find((u) => `utensil-${u.id}` === payload.id)
  if (!utensil) return
  addItem({
    id: payload.id,
    name: utensil.name,
    price: utensil.price,
    image: utensil.image,
    quantity: payload.quantity,
  })
  showToast(`已加入購物車：${utensil.name}`, 'success')
}

// 管理員編輯模式
const editMode = ref(false)
const formMode = ref<'add' | 'edit' | null>(null)
const editingUtensil = ref<CoffeeUtensilItem | null>(null)

function openAddForm() {
  editingUtensil.value = null
  formMode.value = 'add'
}

function openEditForm(utensil: CoffeeUtensilItem) {
  editingUtensil.value = utensil
  formMode.value = 'edit'
}

function closeForm() {
  formMode.value = null
  editingUtensil.value = null
}

const utensilFormSelectFields = computed(() => [
  {
    key: 'category',
    label: '類別',
    options: visibleCategories.value,
    initialValue: editingUtensil.value?.category ?? visibleCategories.value[0] ?? '',
  },
])

async function handleFormSubmit(payload: {
  name: string
  image: string
  price: number
  stock: number
  selections: Record<string, string>
}) {
  if (!(await verifyAdminPermission())) {
    editMode.value = false
    closeForm()
    return
  }

  const category = payload.selections.category ?? visibleCategories.value[0] ?? ''
  const wasAdd = formMode.value === 'add'

  try {
    if (wasAdd) {
      await addUtensil({ name: payload.name, image: payload.image, price: payload.price, stock: payload.stock, category })
    } else if (formMode.value === 'edit' && editingUtensil.value) {
      await updateUtensil(editingUtensil.value.id, {
        name: payload.name,
        image: payload.image,
        price: payload.price,
        stock: payload.stock,
        category,
      })
    }
    showToast(wasAdd ? `已新增商品：${payload.name}` : `已更新商品：${payload.name}`, 'success')
    closeForm()
  } catch (err) {
    showToast(err instanceof ApiError ? err.message : '操作失敗，請稍後再試', 'error')
  }
}

const pendingDeleteUtensil = ref<CoffeeUtensilItem | null>(null)

function requestDelete(utensil: CoffeeUtensilItem) {
  pendingDeleteUtensil.value = utensil
}

function cancelDelete() {
  pendingDeleteUtensil.value = null
}

async function confirmDelete() {
  const utensil = pendingDeleteUtensil.value
  pendingDeleteUtensil.value = null
  if (!utensil) return

  if (!(await verifyAdminPermission())) {
    editMode.value = false
    return
  }

  try {
    await removeUtensil(utensil.id)
    showToast(`已刪除商品：${utensil.name}`, 'success')
  } catch (err) {
    showToast(err instanceof ApiError ? err.message : '刪除失敗，請稍後再試', 'error')
  }
}

// 類別管理
const categoryManagerOpen = ref(false)

const categoryGroups = computed(() => [
  {
    key: 'category',
    title: '類別',
    items: categories.value.map((value) => ({ value, hidden: hiddenCategories.value.has(value) })),
  },
])

async function handleCategoryAdd(payload: { groupKey: string; value: string }) {
  if (!(await verifyAdminPermission())) {
    editMode.value = false
    categoryManagerOpen.value = false
    return
  }
  try {
    await addCategory(payload.value)
    showToast(`已新增類別：${payload.value}`, 'success')
  } catch (err) {
    showToast(err instanceof ApiError ? err.message : '新增類別失敗', 'error')
  }
}

async function handleCategoryToggleHidden(payload: { groupKey: string; value: string }) {
  if (!(await verifyAdminPermission())) {
    editMode.value = false
    categoryManagerOpen.value = false
    return
  }

  const isCurrentlyHidden = hiddenCategories.value.has(payload.value)
  if (!isCurrentlyHidden && visibleCategories.value.length <= 1) {
    showToast('至少須保留一個顯示項目', 'error')
    return
  }

  try {
    await toggleCategoryHidden(payload.value)
  } catch (err) {
    showToast(err instanceof ApiError ? err.message : '操作失敗，請稍後再試', 'error')
    return
  }

  if (!isCurrentlyHidden && selectedCategory.value === payload.value) {
    selectedCategory.value = null
  }

  showToast(isCurrentlyHidden ? `已顯示類別：${payload.value}` : `已隱藏類別：${payload.value}`, 'success')
}
</script>

<template>
  <div class="coffee-utensil-page">
    <div v-if="isAdmin" class="admin-toolbar">
      <button type="button" class="admin-toolbar__toggle" @click="editMode = !editMode">
        {{ editMode ? '結束編輯' : '編輯模式' }}
      </button>
      <button v-if="editMode" type="button" class="admin-toolbar__add" @click="openAddForm">+ 新增商品</button>
      <button type="button" class="admin-toolbar__category" @click="categoryManagerOpen = true">類別管理</button>
    </div>

    <div class="coffee-utensil">
      <aside class="filter">
        <div class="filter__group">
          <h3 class="filter__title">類別</h3>
          <ul class="filter__list">
            <li v-for="category in visibleCategories" :key="category">
              <button
                type="button"
                class="filter__item"
                :class="{ 'filter__item--active': selectedCategory === category }"
                @click="toggleCategory(category)"
              >
                {{ category }}
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <section class="products">
        <div class="products__toolbar">
          <input
            v-model="searchQuery"
            type="search"
            class="products__search"
            placeholder="搜尋器具名稱..."
            aria-label="搜尋器具名稱"
          />
          <select v-model="sortOption" class="products__sort" aria-label="排序方式">
            <option value="default">預設排序</option>
            <option value="price-asc">價格由低到高</option>
            <option value="price-desc">價格由高到低</option>
            <option value="name">名稱排序</option>
          </select>
        </div>

        <p v-if="filteredUtensils.length === 0" class="products__empty">找不到符合條件的商品</p>

        <div v-else class="products__grid">
          <div v-for="utensil in filteredUtensils" :key="utensil.id" class="product-cell">
            <ShopItem
              :id="`utensil-${utensil.id}`"
              :name="utensil.name"
              :price="utensil.price"
              :image="utensil.image"
              :stock="utensil.stock"
              @add-to-cart="handleAddToCart"
            />
            <div v-if="editMode" class="product-cell__admin-actions">
              <button type="button" aria-label="編輯商品" @click="openEditForm(utensil)">✎</button>
              <button type="button" aria-label="刪除商品" @click="requestDelete(utensil)">🗑</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <ProductFormModal
      v-if="formMode"
      :title="formMode === 'add' ? '新增器具' : '編輯器具'"
      :initial-name="editingUtensil?.name"
      :initial-image="editingUtensil?.image"
      :initial-price="editingUtensil?.price"
      :initial-stock="editingUtensil?.stock"
      :select-fields="utensilFormSelectFields"
      @submit="handleFormSubmit"
      @cancel="closeForm"
    />

    <CategoryManagerModal
      v-if="categoryManagerOpen"
      :groups="categoryGroups"
      @add="handleCategoryAdd"
      @toggle="handleCategoryToggleHidden"
      @close="categoryManagerOpen = false"
    />

    <ConfirmDialog
      v-if="pendingDeleteUtensil"
      title="刪除商品"
      :message="`確定要刪除「${pendingDeleteUtensil.name}」嗎？此動作無法復原。`"
      confirm-label="刪除"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<style scoped>
.coffee-utensil-page {
  width: 100%;
}

.admin-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.admin-toolbar__toggle,
.admin-toolbar__add,
.admin-toolbar__category {
  padding: 8px 16px;
  border: 1px solid var(--color-brand);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-brand);
  cursor: pointer;
}

.admin-toolbar__add {
  background: var(--color-brand);
  color: var(--color-on-brand);
}

.coffee-utensil {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
}

.filter {
  flex: 0 0 180px;
}

.filter__title {
  margin-bottom: 12px;
  font-size: 1.1rem;
  color: var(--color-heading);
}

.filter__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
}

.filter__item {
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.filter__item:hover {
  border-color: var(--color-border-hover);
}

.filter__item--active {
  border-color: hsla(160, 100%, 37%, 1);
  background: hsla(160, 100%, 37%, 0.15);
  color: hsla(160, 100%, 37%, 1);
}

.products {
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.products__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.products__search {
  flex: 1 1 220px;
  max-width: 320px;
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 0.95rem;
}

.products__sort {
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 0.9rem;
}

.products__empty {
  padding: 24px;
  text-align: center;
  color: var(--color-text);
  opacity: 0.7;
}

.products__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.product-cell {
  position: relative;
  display: flex;
}

.product-cell__admin-actions {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  display: flex;
  gap: 6px;
}

.product-cell__admin-actions button {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 999px;
  background: var(--color-background);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  font-size: 0.85rem;
  line-height: 1;
}

@media (min-width: 700px) {
  .products__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1000px) {
  .products__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .coffee-utensil {
    flex-direction: column;
  }

  .filter {
    width: 100%;
    flex: none;
  }

  .products__grid {
    grid-template-columns: 1fr;
  }
}
</style>
