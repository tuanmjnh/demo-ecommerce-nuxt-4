<script setup lang="ts">
// Nhận data từ cha truyền xuống
defineProps<{
  data: any // Hoặc type cụ thể Models.Page
}>()
</script>

<template>
  <UContainer class="py-10">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ data?.title }}
    </h1>

    <div class="prose dark:prose-invert max-w-none" v-html="data?.content">
    </div>
  </UContainer>
</template>
