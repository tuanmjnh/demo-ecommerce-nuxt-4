<script setup lang="ts">
// Dữ liệu trang (Có thể lấy từ API/Content sau này)
const pageData = ref({
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
    items: [
      { title: 'Căn hộ The Signature', description: 'Hiện đại, Tối giản', to: '/project/1', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600' },
      { title: 'Biệt thự Ecopark', description: 'Indochine, Sang trọng', to: '/project/2', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600' },
      { title: 'Nhà phố Quận 2', description: 'Scandinavian', to: '/project/3', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600' }
    ]
  },
  blog: {
    title: 'Tin tức & Kinh nghiệm',
    items: [
      { title: 'Bí quyết chọn sofa cho phòng khách nhỏ', description: 'Tối ưu không gian...', icon: 'i-heroicons-light-bulb' },
      { title: 'Phong thủy phòng ngủ', description: 'Để có giấc ngủ ngon...', icon: 'i-heroicons-moon' },
      { title: 'Bố trí ánh sáng', description: 'Hack không gian rộng hơn...', icon: 'i-heroicons-sun' }
    ]
  }
})

useSeoMeta({
  title: 'LuxeDesign - Kiến tạo không gian sống đẳng cấp',
  description: pageData.value.about.description
})
</script>

<template>
  <div class="font-body text-gray-900 dark:text-gray-100">
    <HomeHero />

    <HomeAbout :data="pageData.about" />

    <HomeProjects :title="pageData.projects.title" :items="pageData.projects.items" />

    <HomeBlog :data="pageData.blog" />

    <USeparator />

    <HomeCTA />
  </div>
</template>