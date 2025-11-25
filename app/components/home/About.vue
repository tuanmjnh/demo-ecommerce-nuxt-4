<script setup lang="ts">
defineProps<{
  data: {
    title: string;
    description: string;
    images: string[];
  }
}>()
</script>

<template>
  <UPageSection :title="data.title" :description="data.description" align="left"
    :ui="{ wrapper: 'py-16 sm:py-24', title: 'font-display text-3xl md:text-4xl font-bold' }">
    <template #links>
      <UButton color="primary" variant="solid" size="lg" class="rounded-full mt-6 font-bold px-8"
        label="Xem hồ sơ năng lực" trailing-icon="i-heroicons-arrow-right-20-solid" />
    </template>

    <template #default>
      <Motion class="grid grid-cols-2 grid-rows-2 gap-4 h-full min-h-[400px]" :initial="{ opacity: 0, x: 50 }"
        :while-in-view="{ opacity: 1, x: 0 }" :transition="{ duration: 0.8, delay: 0.2 }"
        :in-view-options="{ once: true }">
        <img :src="data.images[0]"
          class="w-full h-full object-cover rounded-2xl col-span-2 row-span-1 aspect-video shadow-lg hover:shadow-xl transition-shadow" />
        <img :src="data.images[1]"
          class="w-full h-full object-cover rounded-2xl aspect-square shadow-lg hover:shadow-xl transition-shadow" />
        <img :src="data.images[2]"
          class="w-full h-full object-cover rounded-2xl aspect-square shadow-lg hover:shadow-xl transition-shadow" />
      </Motion>
    </template>
  </UPageSection>
</template>