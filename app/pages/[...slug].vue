<script setup lang="ts">
// 👇 LAZY LOAD: Chỉ tải code của component khi cần dùng tới
// const PageDetail = defineAsyncComponent(() => import('~/components/templates/PageDetail.vue'))
// const PostDetail = defineAsyncComponent(() => import('~/components/templates/PostDetail.vue'))
// const ProjectList = defineAsyncComponent(() => import('~/components/templates/ProjectList.vue'))
// const ProductDetail = defineAsyncComponent(() => import('~/components/templates/ProductDetail.vue'))

const route = useRoute()
const currentSlug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const typeHint = import.meta.client ? window.history.state?.typeHint : null

// Gọi API resolve slug
const { data: pageData, error } = await useAsyncData(`route-${currentSlug}`, () => useAPI('menu/resolve-slug', { params: { url: currentSlug } }))
// if (error.value || !pageData.value) {
//   throw createError({ statusCode: 404, fatal: true })
// }
//
// Map Type -> Component
const viewComponent = computed(() => {
  const type = pageData.value?.type
  console.info(type)
  // switch (type) {
  //   case 'PAGE': return PageDetail
  //   case 'POST': return PostDetail
  //   case 'CATEGORY': return ProjectList // Dùng cho danh mục dự án
  //   case 'PRODUCT': return ProductDetail
  //   default: return PageDetail
  // }
  switch (type) {
    // Nuxt tự động ghép tên thư mục + tên file
    // components/templates/PageDetail.vue -> 'TemplatesPageDetail'
    case 'PAGE': return resolveComponent('TemplatesPageDetail')
    case 'POST': return resolveComponent('TemplatesProjectDetail')
    case 'CATEGORY': return resolveComponent('TemplatesProjectList')
    case 'PRODUCT': return resolveComponent('TemplatesProductDetail')
    default: return resolveComponent('TemplatesPageDetail')
  }
})

// SEO Meta
// useSeoMeta({
//   title: () => pageData.value?.title,
//   description: () => pageData.value?.description,
//   ogImage: () => pageData.value?.thumbnail
// })
</script>

<template>
  <div class="dynamic-page">
    <component :is="viewComponent" :data="pageData" />
  </div>
</template>
