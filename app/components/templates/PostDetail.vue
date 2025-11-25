<script setup lang="ts">
defineProps<{ data: any }>()
</script>

<template>
  <article>
    <div class="bg-gray-100 dark:bg-gray-800 py-12 mb-8">
      <UContainer>
        <UBadge :label="data?.categoryName" color="primary" variant="subtle" class="mb-4" />
        <h1 class="text-4xl font-extrabold">{{ data?.title }}</h1>
        <p class="text-gray-500 mt-2">Đăng ngày: {{ new Date(data?.created.at).toLocaleDateString() }}</p>
      </UContainer>
    </div>

    <UContainer>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 prose dark:prose-invert" v-html="data?.content"></div>

        <aside>
          <h3 class="font-bold mb-4">Bài viết cùng chuyên mục</h3>
        </aside>
      </div>
    </UContainer>
  </article>
</template>
