<script setup lang="ts">
defineProps<{
  filled?: boolean
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="M12 21s-6.716-4.35-9.428-8.028C1.11 10.63 1.5 7.5 4.2 6.1 6.2 5.07 8.6 5.7 10 7.3L12 9.5l2-2.2c1.4-1.6 3.8-2.23 5.8-1.2 2.7 1.4 3.09 4.53 1.63 6.87C18.72 16.65 12 21 12 21z"
    />
  </svg>
</template>
