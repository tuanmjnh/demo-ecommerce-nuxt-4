<script setup lang="ts">
defineProps<{
  data?: Models.ICompany | null
}>()
</script>
<template>
  <div class="relative overflow-hidden">
    <div class="absolute inset-0 bg-primary-950">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
    </div>

    <UPageCTA title="Bạn đã sẵn sàng sở hữu không gian mơ ước?"
      description="Để lại thông tin, chúng tôi sẽ liên hệ tư vấn miễn phí ngay hôm nay." align="center"
      class="relative z-10 py-20 rounded-none" :ui="{
        title: 'dark:text-white font-display text-3xl md:text-4xl',
        description: 'dark:text-white text-primary-400 text-lg'
      }">
      <template #links>
        <div class="flex flex-col sm:flex-row gap-4 mt-6">
          <UButton :to="`https://www.facebook.com/${data?.social?.facebook}`" target="_blank" size="xl" color="primary"
            variant="solid" class="font-bold text-white rounded-full px-8"
            :label="`Facebook: ${data?.social?.facebook}`" />
          <UButton :to="`https://zalo.me/${data?.hotline}`" target="_blank" size="xl" color="primary" variant="outline"
            class="font-bold dark:text-white hover:bg-white/10 rounded-full px-8"
            :label="`Gọi Hotline: ${data?.hotline}`" />
        </div>
      </template>
    </UPageCTA>
  </div>
</template>