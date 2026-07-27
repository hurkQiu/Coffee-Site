<template>
  <div class="item">
    <i>
      <slot name="icon"></slot>
    </i>
    <div class="details">
      <h3>
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 16px;
  text-align: center;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.item:hover {
  transform: translateY(-4px);
  border-color: var(--color-brand-light);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}

.details {
  flex: 1;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 48px;
  height: 48px;
  color: var(--color-brand);
}

i :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

h3 {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-heading);
}

h3 :deep(a) {
  color: inherit;
  text-decoration: none;
}
</style>
