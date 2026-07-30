<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ShopItem from './ShopItem.vue'
import ProductFormModal from './ProductFormModal.vue'
import CategoryManagerModal from './CategoryManagerModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import { useCart } from '@/stores/cart'
import { useAuth } from '@/stores/auth'
import { useBeans, type CoffeeBean } from '@/stores/beans'
import { useToast } from '@/stores/toast'
import { ApiError } from '@/lib/api'

const { addItem } = useCart()
const { isAdmin, verifyAdminPermission } = useAuth()
const { showToast } = useToast()
const route = useRoute()

const {
  beans,
  roastLevels,
  processMethods,
  visibleRoastLevels,
  visibleProcessMethods,
  addBean,
  updateBean,
  removeBean,
  addRoastLevel,
  addProcessMethod,
  toggleRoastHidden,
  toggleProcessHidden,
  hiddenRoasts,
  hiddenProcesses,
} = useBeans()

function isRoastLevel(value: unknown): value is string {
  return typeof value === 'string' && visibleRoastLevels.value.includes(value)
}

const selectedRoast = ref<string | null>(
  isRoastLevel(route.query.roast) ? route.query.roast : null,
)
const selectedProcess = ref<string | null>(null)

watch(
  () => route.query.roast,
  (value) => {
    selectedRoast.value = isRoastLevel(value) ? value : null
  },
)

function toggleRoast(roast: string) {
  selectedRoast.value = selectedRoast.value === roast ? null : roast
}

function toggleProcess(process: string) {
  selectedProcess.value = selectedProcess.value === process ? null : process
}

const searchQuery = ref('')
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name'
const sortOption = ref<SortOption>('default')

const filteredBeans = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  const list = beans.value.filter(
    (bean) =>
      (!selectedRoast.value || bean.roast === selectedRoast.value) &&
      (!selectedProcess.value || bean.process === selectedProcess.value) &&
      (!keyword || bean.name.toLowerCase().includes(keyword)),
  )
  const sorted = [...list]
  if (sortOption.value === 'price-asc') sorted.sort((a, b) => a.price - b.price)
  else if (sortOption.value === 'price-desc') sorted.sort((a, b) => b.price - a.price)
  else if (sortOption.value === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
  return sorted
})

function handleAddToCart(payload: { id: string; quantity: number }) {
  const bean = beans.value.find((b) => `bean-${b.id}` === payload.id)
  if (!bean) return
  addItem({
    id: payload.id,
    name: bean.name,
    price: bean.price,
    image: bean.image,
    quantity: payload.quantity,
  })
  showToast(`已加入購物車：${bean.name}`, 'success')
}

// 管理員編輯模式
const editMode = ref(false)
const formMode = ref<'add' | 'edit' | null>(null)
const editingBean = ref<CoffeeBean | null>(null)

function openAddForm() {
  editingBean.value = null
  formMode.value = 'add'
}

function openEditForm(bean: CoffeeBean) {
  editingBean.value = bean
  formMode.value = 'edit'
}

function closeForm() {
  formMode.value = null
  editingBean.value = null
}

const beanFormSelectFields = computed(() => [
  {
    key: 'roast',
    label: '烘焙度',
    options: visibleRoastLevels.value,
    initialValue: editingBean.value?.roast ?? visibleRoastLevels.value[0] ?? '',
  },
  {
    key: 'process',
    label: '處理法',
    options: visibleProcessMethods.value,
    initialValue: editingBean.value?.process ?? visibleProcessMethods.value[0] ?? '',
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

  const roast = payload.selections.roast ?? visibleRoastLevels.value[0] ?? ''
  const process = payload.selections.process ?? visibleProcessMethods.value[0] ?? ''
  const wasAdd = formMode.value === 'add'

  try {
    if (wasAdd) {
      await addBean({ name: payload.name, image: payload.image, price: payload.price, stock: payload.stock, roast, process })
    } else if (formMode.value === 'edit' && editingBean.value) {
      await updateBean(editingBean.value.id, {
        name: payload.name,
        image: payload.image,
        price: payload.price,
        stock: payload.stock,
        roast,
        process,
      })
    }
    showToast(wasAdd ? `已新增商品：${payload.name}` : `已更新商品：${payload.name}`, 'success')
    closeForm()
  } catch (err) {
    showToast(err instanceof ApiError ? err.message : '操作失敗，請稍後再試', 'error')
  }
}

const pendingDeleteBean = ref<CoffeeBean | null>(null)

function requestDelete(bean: CoffeeBean) {
  pendingDeleteBean.value = bean
}

function cancelDelete() {
  pendingDeleteBean.value = null
}

async function confirmDelete() {
  const bean = pendingDeleteBean.value
  pendingDeleteBean.value = null
  if (!bean) return

  if (!(await verifyAdminPermission())) {
    editMode.value = false
    return
  }

  try {
    await removeBean(bean.id)
    showToast(`已刪除商品：${bean.name}`, 'success')
  } catch (err) {
    showToast(err instanceof ApiError ? err.message : '刪除失敗，請稍後再試', 'error')
  }
}

// 類別管理（烘焙度／處理法）
const categoryManagerOpen = ref(false)

const categoryGroups = computed(() => [
  {
    key: 'roast',
    title: '烘焙度',
    items: roastLevels.value.map((value) => ({ value, hidden: hiddenRoasts.value.has(value) })),
  },
  {
    key: 'process',
    title: '處理法',
    items: processMethods.value.map((value) => ({ value, hidden: hiddenProcesses.value.has(value) })),
  },
])

async function handleCategoryAdd(payload: { groupKey: string; value: string }) {
  if (!(await verifyAdminPermission())) {
    editMode.value = false
    categoryManagerOpen.value = false
    return
  }
  try {
    if (payload.groupKey === 'roast') await addRoastLevel(payload.value)
    else await addProcessMethod(payload.value)
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

  const isRoast = payload.groupKey === 'roast'
  const hiddenSet = isRoast ? hiddenRoasts : hiddenProcesses
  const visibleList = isRoast ? visibleRoastLevels : visibleProcessMethods
  const isCurrentlyHidden = hiddenSet.value.has(payload.value)

  if (!isCurrentlyHidden && visibleList.value.length <= 1) {
    showToast('至少須保留一個顯示項目', 'error')
    return
  }

  try {
    if (isRoast) await toggleRoastHidden(payload.value)
    else await toggleProcessHidden(payload.value)
  } catch (err) {
    showToast(err instanceof ApiError ? err.message : '操作失敗，請稍後再試', 'error')
    return
  }

  if (!isCurrentlyHidden) {
    if (isRoast && selectedRoast.value === payload.value) selectedRoast.value = null
    if (!isRoast && selectedProcess.value === payload.value) selectedProcess.value = null
  }

  showToast(isCurrentlyHidden ? `已顯示類別：${payload.value}` : `已隱藏類別：${payload.value}`, 'success')
}
</script>

<template>
  <div class="coffee-beans-page">
    <div v-if="isAdmin" class="admin-toolbar">
      <button type="button" class="admin-toolbar__toggle" @click="editMode = !editMode">
        {{ editMode ? '結束編輯' : '編輯模式' }}
      </button>
      <button v-if="editMode" type="button" class="admin-toolbar__add" @click="openAddForm">+ 新增商品</button>
      <button type="button" class="admin-toolbar__category" @click="categoryManagerOpen = true">類別管理</button>
    </div>

    <div class="coffee-beans">
      <aside class="filter">
        <div class="filter__group">
          <h3 class="filter__title">烘焙度</h3>
          <ul class="filter__list">
            <li v-for="roast in visibleRoastLevels" :key="roast">
              <button
                type="button"
                class="filter__item"
                :class="{ 'filter__item--active': selectedRoast === roast }"
                @click="toggleRoast(roast)"
              >
                {{ roast }}
              </button>
            </li>
          </ul>
        </div>

        <hr class="filter__divider" />

        <div class="filter__group">
          <h3 class="filter__title">處理法</h3>
          <ul class="filter__list">
            <li v-for="process in visibleProcessMethods" :key="process">
              <button
                type="button"
                class="filter__item"
                :class="{ 'filter__item--active': selectedProcess === process }"
                @click="toggleProcess(process)"
              >
                {{ process }}
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
            placeholder="搜尋咖啡豆名稱..."
            aria-label="搜尋咖啡豆名稱"
          />
          <select v-model="sortOption" class="products__sort" aria-label="排序方式">
            <option value="default">預設排序</option>
            <option value="price-asc">價格由低到高</option>
            <option value="price-desc">價格由高到低</option>
            <option value="name">名稱排序</option>
          </select>
        </div>

        <p v-if="filteredBeans.length === 0" class="products__empty">找不到符合條件的商品</p>

        <div v-else class="products__grid">
          <div v-for="bean in filteredBeans" :key="bean.id" class="product-cell">
            <ShopItem
              :id="`bean-${bean.id}`"
              :name="bean.name"
              :price="bean.price"
              :image="bean.image"
              :stock="bean.stock"
              @add-to-cart="handleAddToCart"
            />
            <div v-if="editMode" class="product-cell__admin-actions">
              <button type="button" aria-label="編輯商品" @click="openEditForm(bean)">✎</button>
              <button type="button" aria-label="刪除商品" @click="requestDelete(bean)">🗑</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <ProductFormModal
      v-if="formMode"
      :title="formMode === 'add' ? '新增咖啡豆' : '編輯咖啡豆'"
      :initial-name="editingBean?.name"
      :initial-image="editingBean?.image"
      :initial-price="editingBean?.price"
      :initial-stock="editingBean?.stock"
      :select-fields="beanFormSelectFields"
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
      v-if="pendingDeleteBean"
      title="刪除商品"
      :message="`確定要刪除「${pendingDeleteBean.name}」嗎？此動作無法復原。`"
      confirm-label="刪除"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<style scoped>
.coffee-beans-page {
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

.coffee-beans {
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

.filter__divider {
  margin: 16px 0;
  border: none;
  border-top: 1px solid var(--color-border);
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
  .coffee-beans {
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
