<script setup lang="ts">
defineProps<{
  items: any[]
  title: string
}>()
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 py-16">
    <UPageSection :title="title" align="center" :ui="{
      title: 'font-display font-bold text-3xl md:text-4xl text-gray-900 dark:text-white'
    }">
      <UPageGrid>
        <Motion v-for="(item, index) in items" :key="index" :initial="{ opacity: 0, y: 50 }"
          :while-in-view="{ opacity: 1, y: 0 }" :transition="{ delay: 0.1 * index, duration: 0.6, type: 'spring' }"
          :in-view-options="{ once: true }">
          <UPageCard :to="item.to"
            class="group h-full rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-none ring-1 ring-gray-200 dark:ring-gray-800"
            :ui="{
              header: 'p-0 sm:p-0',
              body: 'p-0 sm:p-0',
              // Quan trọng: Set màu nền cho Card
              wrapper: 'bg-white dark:bg-gray-800'
            }">
            <template #header>
              <div class="overflow-hidden aspect-[4/3] relative">
                <div
                  class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                </div>
                <img :src="item.image"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
              </div>
            </template>

            <template #default>
              <div class="p-6 flex flex-col gap-2 bg-white dark:bg-gray-900">
                <h3
                  class="font-display text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-400 transition-colors">
                  {{ item.title }}
                </h3>

                <p class="text-sm text-gray-500 dark:text-gray-400 font-body">
                  {{ item.description }}
                </p>

                <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Xem chi tiết</span>
                  <UIcon name="i-heroicons-arrow-right"
                    class="w-5 h-5 text-primary-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </template>
          </UPageCard>
        </Motion>
      </UPageGrid>
    </UPageSection>
  </div>
</template>