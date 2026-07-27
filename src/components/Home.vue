<script setup lang="ts">

import { RouteName } from '@/router/routeName.ts'
import IconSupport from './icons/IconSupport.vue';
import IconGrading from './icons/IconGrading.vue';
import IconProcessing from './icons/IconProcessing.vue';
import IconUtensil from './icons/IconUtensil.vue';
import HomeItem from './icons/HomeItem.vue';
import IconBean from './icons/IconBean.vue';

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="home">
    <section class="hero">
      <p class="hero__eyebrow">精品咖啡 · 器具嚴選</p>
      <h1 class="hero__title">從產地到手沖，成就每一杯好咖啡</h1>
      <p class="hero__subtitle">嚴選單品咖啡豆與專業沖煮器具，讓你在家也能沖出職人等級的風味。</p>
      <div class="hero__actions">
        <RouterLink :to="{ name: RouteName.COFFEE_BEANS }" class="hero__cta hero__cta--primary">選購咖啡豆</RouterLink>
        <RouterLink :to="{ name: RouteName.COFFEE_UTENSIL }" class="hero__cta hero__cta--secondary">選購器具</RouterLink>
      </div>
    </section>

    <main class="list">
      <HomeItem>
        <template #icon>
          <IconBean />
        </template>
        <template #heading><RouterLink :to="{name: RouteName.COFFEE_BEANS}">Coffee Beans</RouterLink></template>
      </HomeItem>

      <HomeItem>
        <template #icon>
          <IconUtensil />
        </template>
        <template #heading><RouterLink :to="{name: RouteName.COFFEE_UTENSIL}">Coffee Utensil</RouterLink></template>
      </HomeItem>

      <HomeItem>
        <template #icon>
          <IconProcessing />
        </template>
        <template #heading><RouterLink :to="{name: RouteName.PROCESSING}">Processing Knowledge</RouterLink></template>

      </HomeItem>

      <HomeItem>
        <template #icon>
          <IconGrading />
        </template>
        <template #heading><RouterLink :to="{name: RouteName.GRADING}">Grading</RouterLink></template>
      </HomeItem>

      <HomeItem>
        <template #icon>
          <IconSupport />
        </template>
        <template #heading><RouterLink :to="{name: RouteName.CONTACT}">Contact Us</RouterLink></template>
      </HomeItem>
    </main>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
}

.hero {
  padding: 56px 40px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-brand-dark), var(--color-brand));
  color: var(--color-on-brand);
  text-align: center;
}

.hero__eyebrow {
  margin-bottom: 12px;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  font-weight: bold;
}

.hero__title {
  margin-bottom: 16px;
  font-size: 2rem;
  line-height: 1.4;
}

.hero__subtitle {
  max-width: 520px;
  margin: 0 auto 28px;
  opacity: 0.9;
  line-height: 1.7;
}

.hero__actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.hero__cta {
  padding: 12px 28px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.2s, opacity 0.2s;
}

.hero__cta:hover {
  transform: translateY(-2px);
}

.hero__cta--primary {
  background: var(--color-accent);
  color: var(--color-brand-dark);
}

.hero__cta--secondary {
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: var(--color-on-brand);
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
}

@media (min-width: 1024px) {
  .hero {
    padding: 72px 40px;
  }
}
</style>
