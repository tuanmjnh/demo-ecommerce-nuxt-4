<script setup lang="ts">
// Props nhận data từ trang cha
const props = defineProps<{
  data: {
    title: string;
    description?: string;
    // API cần trả về danh sách items con trong object data này
    items: Array<{
      title: string;
      slug: string; // hoặc url
      thumbnail: string;
      location?: string; // Địa điểm thi công
      year?: string;
    }>
  }
}>()
</script>

<template>
  <div class="project-list-page pb-20">
    <div class="bg-gray-50 dark:bg-gray-900 py-16 mb-10">
      <UContainer class="text-center">
        <h1 class="text-4xl font-bold mb-4 uppercase tracking-wider">{{ data.title }}</h1>
        <p class="text-gray-500 max-w-2xl mx-auto">{{ data.description }}</p>
      </UContainer>
    </div>

    <UContainer>
      <div v-if="data.items && data.items.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        <NuxtLink v-for="(item, index) in data.items" :key="index"
          :to="item.slug.startsWith('/') ? item.slug : `/du-an/${item.slug}`" class="group block">
          <div
            class="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">

            <div class="aspect-[4/3] overflow-hidden">
              <img :src="item.thumbnail || 'https://placehold.co/600x400?text=Project'" :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy" />
            </div>

            <div class="p-5">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {{ item.title }}
                </h3>
              </div>

              <div class="flex items-center text-sm text-gray-500 gap-3">
                <span v-if="item.location" class="flex items-center gap-1">
                  <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
                  {{ item.location }}
                </span>
                <span v-if="item.year" class="flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                  {{ item.year }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>

      </div>

      <div v-else class="text-center py-20 text-gray-400">
        <UIcon name="i-lucide-folder-open" class="w-16 h-16 mb-4 mx-auto" />
        <p>Chưa có dự án nào trong danh mục này.</p>
      </div>
    </UContainer>
  </div>
</template>
