<script setup lang="ts">
defineProps<{
  project: any
}>()
</script>

<template>
  <NuxtLink :to="`/${project.slug}`" class="group flex flex-col gap-3 cursor-pointer">
    <div class="relative w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
      <div class="aspect-3/4 w-full relative">
        <NuxtImg :src="project.image" :alt="project.title" width="600" height="800" fit="cover" format="webp"
          loading="lazy" placeholder
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
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
        {{ project.desc }}
      </p>
    </div>
  </NuxtLink>
</template>