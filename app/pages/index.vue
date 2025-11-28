<script setup lang="ts">
// Fetch home page data from API
const { data: homeData, error } = await useAsyncData('home-page', async () => {
  const response = await useAPI<Common.IResponseItems>('home')
  return response.data
})

// Fallback data in case API fails
const pageData = computed(() => homeData.value || {
  hero: {
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop'
    ]
  },
  about: {
    title: 'Về LuxeDesign',
    description: 'Chúng tôi tin rằng mỗi công trình không chỉ là một tài sản, mà còn là nơi vun đắp hạnh phúc và phản ánh dấu ấn cá nhân của gia chủ.',
    images: [
      'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'
    ]
  },
  projects: {
    title: 'Mẫu thiết kế mới nhất',
    items: []
  },
  blog: {
    title: 'Tin tức & Kinh nghiệm',
    items: []
  }
})

useSeoMeta({
  title: 'LuxeDesign - Kiến tạo không gian sống đẳng cấp',
  description: pageData.value.about?.description || 'Kiến tạo không gian sống đẳng cấp'
})
</script>


<template>
  <div class="font-body text-gray-900 dark:text-gray-100">
    <HomeHero :images="pageData.hero?.images" />

    <HomeAbout :data="pageData.about" />

    <HomeProjects :title="pageData.projects?.title" :items="pageData.projects?.items" />

    <HomeBlog :data="pageData.blog" />

    <USeparator />

    <HomeCTA />
  </div>
</template>