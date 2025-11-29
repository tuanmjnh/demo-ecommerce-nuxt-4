<script setup lang="ts">
// Fetch home page data from API
const company = computed(() => useCompanyStore().info)
const { data: pageData } = await useAsyncData('home-page', async () => {
  const [postHighLight, postNew, news] = await Promise.all([
    // useAPI<Common.IResponseItem>('company/public'),
    useAPI<Common.IResponseItems>('posts/public', {
      method: 'POST',
      body: { key: 'post', pins: 'POST_FEATURED', limit: 6, sort: '-createdAt' }
    }),
    useAPI<Common.IResponseItems>('posts/public', {
      method: 'POST',
      body: { key: 'post', limit: 6, sort: '-createdAt' }
    }),
    useAPI<Common.IResponseItems>('posts/public', {
      method: 'POST',
      body: { key: 'news', limit: 5, sort: '-createdAt' }
    })
  ])

  return {
    postHighLight: {
      title: 'Mẫu thiết kế nổi bật',
      items: postHighLight.data?.items || [],
    },
    postNew: {
      title: 'Mẫu thiết kế mới',
      items: postNew.data?.items || []
    },
    news: {
      title: 'Tin tức & Kinh nghiệm',
      items: news.data?.items || []
    }
  }
})

useSeoMeta({
  title: company?.value?.name || 'Công Ty Kiến Trúc Sư Bắc Kạn',
  ogTitle: company?.value?.name || 'Công Ty Kiến Trúc Sư Bắc Kạn',
  description: company?.value?.desc || 'Kiến tạo không gian sống đẳng cấp',
  ogDescription: company?.value?.desc || 'Kiến tạo không gian sống đẳng cấp',
  ogImage: company?.value?.logo?.url
})
</script>


<template>
  <div class="font-body text-gray-900 dark:text-gray-100">
    <!-- <HomeHero :images="pageData?.company?.images.map((img: any) => img.url)" :slogan="pageData?.company?.slogan" /> -->

    <!-- <HomeAbout :data="pageData?.company" /> -->

    <HomeProjects :title="pageData?.postHighLight?.title" :items="pageData?.postHighLight?.items" />

    <HomeProjects :title="pageData?.postNew?.title" :items="pageData?.postNew?.items" />

    <HomeBlog :title="pageData?.news?.title" :items="pageData?.news?.items" />

    <USeparator />

    <HomeCTA :data="company" />
  </div>
</template>