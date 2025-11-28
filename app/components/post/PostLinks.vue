<script setup lang="ts">
// Định nghĩa Props đầu vào
defineProps({
  title: {
    type: String,
    default: 'Bài viết'
  },
  posts: {
    type: Array as PropType<Models.IPost[]>,
    default: () => []
  }
})
</script>
<template>
  <UCard v-if="posts && posts.length > 0" class="mb-4">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h3>
    </template>

    <div class="flex flex-col gap-y-4">
      <NuxtLink v-for="post in posts" :key="post._id" :to="`/${post.slug}`" class="group flex gap-3 items-start">
        <div
          class="shrink-0 w-24 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative border border-gray-200 dark:border-gray-700">
          <NuxtImg v-if="post.image?.url" :src="post.image.url" :alt="post.title" width="220" height="146" fit="cover"
            format="webp" loading="lazy" placeholder
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800">
            <UIcon name="i-heroicons-photo" class="w-5 h-5" />
          </div>
        </div>

        <div class="flex flex-col min-w-0 flex-1">
          <h4
            class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
            {{ post.title }}
          </h4>

          <p class="text-xs text-gray-500 flex items-center gap-1 mt-auto">
            <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
            {{ formatDate(post.publishedAt) }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </UCard>
</template>
