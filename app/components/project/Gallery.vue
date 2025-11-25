<script setup lang="ts">
defineProps<{
  images: string[]
}>()
</script>

<template>
  <div class="w-full">
    <Motion :initial="{ opacity: 0, y: 20 }" :while-in-view="{ opacity: 1, y: 0 }" :in-view-options="{ once: true }"
      class="text-center mb-10">
      <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Khám phá các góc nhìn khác
      </h2>
      <div class="h-1 w-20 bg-primary-500 mx-auto rounded-full"></div>
    </Motion>

    <div class="columns-2 md:columns-4 gap-4 space-y-4">
      <div v-for="(img, idx) in images" :key="idx" class="break-inside-avoid relative group overflow-hidden rounded-xl">
        <Motion :initial="{ opacity: 0, y: 20 }" :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{ delay: idx * 0.05 }" :in-view-options="{ once: true }">
          <img :src="img" loading="lazy"
            class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
            alt="Project gallery image" />

          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none">
          </div>
        </Motion>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Đảm bảo ảnh hiển thị tốt trên các trình duyệt cũ hơn */
img {
  backface-visibility: hidden;
}
</style>