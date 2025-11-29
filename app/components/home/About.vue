<script setup lang="ts">
defineProps<{
  data: Models.ICompany
}>()
</script>

<template>
  <UPageSection :title="data.name" :description="data.desc" align="left"
    :ui="{ wrapper: 'py-16 sm:py-24', title: 'font-display text-3xl md:text-4xl font-bold' }">
    <template #links>
      <UButton color="primary" variant="solid" size="lg" class="rounded-full mt-6 font-bold px-8"
        label="Xem hồ sơ năng lực" to="/gioi-thieu" trailing-icon="i-lucide-arrow-right" />
    </template>

    <template #default>
      <Motion class="grid grid-cols-1 grid-rows-1 gap-4" :initial="{ opacity: 0, x: 50 }"
        :while-in-view="{ opacity: 1, x: 0 }" :transition="{ duration: 0.8, delay: 0.2 }"
        :in-view-options="{ once: true }">
        <img :src="data.banner?.url"
          class="w-full h-full object-cover rounded-2xl col-span-2 row-span-1 aspect-video shadow-lg hover:shadow-xl transition-shadow" />
        <!-- <img v-for="(img, index) in data.images" :key="index" :src="img.url"
          class="w-full h-full object-cover rounded-2xl aspect-square shadow-lg hover:shadow-xl transition-shadow" /> -->
        <!-- <img :src="data.images[0]"
          class="w-full h-full object-cover rounded-2xl col-span-2 row-span-1 aspect-video shadow-lg hover:shadow-xl transition-shadow" />
        <img :src="data.images[1]"
          class="w-full h-full object-cover rounded-2xl aspect-square shadow-lg hover:shadow-xl transition-shadow" />
        <img :src="data.images[2]"
          class="w-full h-full object-cover rounded-2xl aspect-square shadow-lg hover:shadow-xl transition-shadow" /> -->
      </Motion>
    </template>
  </UPageSection>
</template>