<script setup lang="ts">
defineProps<{
  data: {
    title: string;
    items: any[];
  }
}>()
</script>

<template>
  <UPageSection :title="data.title" align="left" :ui="{
    // Đảm bảo tiêu đề section đổi màu đúng
    title: 'font-display font-bold text-gray-900 dark:text-white'
  }">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
      <div class="lg:col-span-3">
        <Motion class="group flex flex-col gap-4 cursor-pointer" :initial="{ opacity: 0, scale: 0.95 }"
          :while-in-view="{ opacity: 1, scale: 1 }" :transition="{ duration: 0.6 }" :in-view-options="{ once: true }">
          <div class="overflow-hidden rounded-2xl shadow-md">
            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800"
              class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>

          <h3
            class="font-display text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-400 transition-colors mt-2">
            5 Xu hướng thiết kế nội thất sẽ lên ngôi
          </h3>
          <p class="text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            Cùng LuxeDesign khám phá những phong cách thiết kế nội thất đang dẫn đầu xu hướng...
          </p>
        </Motion>
      </div>

      <div class="lg:col-span-2 flex flex-col gap-4">
        <Motion v-for="(news, index) in data.items" :key="index" :initial="{ opacity: 0, x: 20 }"
          :while-in-view="{ opacity: 1, x: 0 }" :transition="{ delay: 0.2 + (0.1 * index) }"
          :in-view-options="{ once: true }">
          <div class="group flex items-center gap-4 p-4 rounded-xl 
            hover:bg-gray-50 dark:hover:bg-gray-800 
            transition-colors cursor-pointer border border-transparent 
            hover:border-gray-200 dark:hover:border-gray-700">
            <div class="bg-primary-50 dark:bg-primary-950 p-3 rounded-xl text-primary-500 shrink-0">
              <UIcon :name="news.icon" class="w-6 h-6" />
            </div>
            <div>
              <h4
                class="font-display font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-400 transition-colors">
                {{ news.title }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                {{ news.description }}
              </p>
            </div>
          </div>
        </Motion>
      </div>
    </div>
  </UPageSection>
</template>