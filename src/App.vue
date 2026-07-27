<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import Home from './components/Home.vue';
import TopBanner from './components/TopBanner.vue';
import ToastContainer from './components/ToastContainer.vue';
</script>

<template>
  <main>
    <header>
      <TopBanner></TopBanner>
    </header>
    <div class="container">
      <RouterView/>
    </div>
    <ToastContainer />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.container{
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

main{
  width: 100%;
  min-height: 100vh;
  background: var(--color-page-bg);
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    width: 100%;
    height: 100px;
    padding-right: calc(var(--section-gap) / 2);
    align-content: space-around;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
