<script setup lang="ts">
const props = defineProps<{
  images?: string[],
  slogan?: string
}>()

const items = computed(() => props.images && props.images.length > 0 ? props.images : [
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop'
])

// Auto play logic đơn giản cho Carousel
// const carouselRef = ref()
// onMounted(() => {
//   setInterval(() => {
//     if (!carouselRef.value) return
//     if (carouselRef.value.page === carouselRef.value.pages) {
//       return carouselRef.value.select(0)
//     }
//     carouselRef.value.next()
//   }, 4000)
// })
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden">
    <UCarousel v-slot="{ item }" loop arrows dots :autoplay="{ delay: 3000 }" :items="items"
      :ui="{ item: 'w-full h-screen' }" class="absolute inset-0 z-0" fade>
      <div class="relative w-full h-full">
        <div class="absolute inset-0 bg-black/40 z-10"></div>
        <Motion class="w-full h-full" :initial="{ scale: 1.1 }" :animate="{ scale: 1 }"
          :transition="{ duration: 5, ease: 'linear', repeat: Infinity, repeatType: 'mirror' }">
          <img :src="item" class="w-full h-full object-cover" draggable="false" />
        </Motion>
      </div>
    </UCarousel>
    <div class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
      <div class="max-w-4xl mx-auto flex flex-col items-center gap-8">
        <Motion tag="h1"
          class="font-display text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-lg"
          :initial="{ opacity: 0, y: 60 }" :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, delay: 0.2, ease: 'easeOut' }">
          <!-- Kiến tạo không gian <br /> sống đẳng cấp -->
          {{ slogan }}
        </Motion>

        <Motion class="flex flex-col sm:flex-row gap-4" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, delay: 0.5, ease: 'easeOut' }">
          <UButton size="xl"
            class="rounded-full px-10 py-4 font-bold font-display shadow-lg hover:scale-105 transition-transform"
            color="primary" variant="solid" label="Xem dự án" to="/du-an" />
          <UButton size="xl"
            class="rounded-full px-10 py-4 font-bold font-display ring-2 ring-white text-white hover:bg-white hover:text-black shadow-lg hover:scale-105 transition-transform"
            variant="ghost" label="Tư vấn miễn phí" />
        </Motion>
      </div>
    </div>

    <Motion class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white" :animate="{ y: [0, 10, 0] }"
      :transition="{ duration: 2, repeat: Infinity }">
      <UIcon name="i-lucide-chevron-down" class="w-10 h-10 opacity-70" />
    </Motion>
  </div>
</template>