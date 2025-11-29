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
const { data: pageData, error } = await useAsyncData(`route-${currentSlug}`, async () =>
  await useAPI('slug', { params: { url: currentSlug } })
)
// if (error.value || !pageData.value) {
//   throw createError({ statusCode: 404, fatal: true })
// }
//
// Map Type -> Component
const viewComponent = computed(() => {
  const type = pageData.value?.type
  switch (type) {
    // components/templates/PageDetail.vue -> 'TemplatesPageDetail'
    case 'PAGE': return resolveComponent('TemplatesPageDetail')
    case 'POST': {
      if (pageData.value?.format === 'gallery')
        return resolveComponent('TemplatesProjectDetail')
      else
        return resolveComponent('TemplatesPostDetail')
    }
    case 'CATEGORY': {
      if (pageData.value.code == 'NEWS')
        return resolveComponent('TemplatesNewsList')
      else
        return resolveComponent('TemplatesProjectList')
    }
    case 'PROJECT': return resolveComponent('TemplatesProjectDetail')
    case 'PRODUCT': return resolveComponent('TemplatesProductDetail')
    default: return resolveComponent('TemplatesPageDetail')
  }
})
// console.log(pageData.value)
// SEO Meta
useSeoMeta({
  title: () => pageData.value?.title,
  description: () => pageData.value?.description,
  ogImage: () => pageData.value?.thumbnail
})
// useSeoMeta({
//   titleTemplate: '',
//   title,
//   ogTitle: title,
//   description,
//   ogDescription: description
// })
</script>

<template>
  <component :is="viewComponent" v-if="pageData" :data="pageData" />
</template>
