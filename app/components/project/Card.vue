<script setup lang="ts">
defineProps<{
  project: any
}>()
</script>

<template>
  <NuxtLink :to="`/projects/${project.id}`" class="group flex flex-col gap-3 cursor-pointer">
    <div class="relative w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
      <div class="aspect-[3/4] w-full relative">
        <img :src="project.image"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt="Project thumbnail" />
        <div
          class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white">
            <UIcon name="i-lucide-search" class="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <h3
        class="font-display text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-400 transition-colors">
        {{ project.title }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 font-body">
        Diện tích: {{ project.area }}
      </p>
    </div>
  </NuxtLink>
</template>