<script setup lang="ts">
const appConfig = useAppConfig()
const colorMode = useColorMode()
const menuStore = useMenuStore()
const companyStore = useCompanyStore()

// Tính toán màu theme cho thanh browser
const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

// --- 1. Fetch Data ---
const { error: fetchError } = await useAsyncData('global-data', async () => {
  const [menuRes, companyRes] = await Promise.all([
    useAPI<Common.IResponseItem>('menu/public'),
    useAPI<Common.IResponseItem>('company/public')
  ])

  if (menuRes?.data) menuStore.flatItems = menuRes.data
  if (companyRes?.data) companyStore.info = companyRes.data

  return true
})

if (fetchError.value) {
  console.error('Global Data Fetch Error:', fetchError.value)
}

// --- 2. SEO Config ---
useSeoMeta({
  // Tiêu đề mặc định: "Trang con - Tên Công Ty"
  titleTemplate: (titleChunk?: string) => {
    return titleChunk
      ? `${titleChunk} - ${companyStore.companyName}`
      : companyStore.companyName
  },

  // Mô tả lấy từ SEO config của công ty hoặc fallback
  description: () => companyStore.info?.seo?.desc || `Trang chủ ${companyStore.companyName}`,

  // Open Graph (Facebook/Zalo)
  ogTitle: () => companyStore.companyName,
  ogDescription: () => companyStore.info?.seo?.desc,
  // Ưu tiên lấy ảnh Banner, nếu không có thì lấy Logo
  ogImage: () => companyStore.info?.banner?.url || companyStore.logoUrl,

  // Twitter
  twitterCard: 'summary_large_image',
  twitterImage: () => companyStore.info?.banner?.url || companyStore.logoUrl,
})

// --- 3. Cấu hình Head
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'vi'
  },
  // Inject JSON-LD Schema (Cấu trúc dữ liệu cho Google)
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        return companyStore.jsonLdSchema
          ? JSON.stringify(companyStore.jsonLdSchema)
          : ''
      })
    }
  ]
})

// --- 3. Logic Search Mới ---
const isSearchOpen = ref(false) // Biến quản lý đóng mở search

// Lắng nghe phím tắt Ctrl+K / Cmd+K
defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isSearchOpen.value = !isSearchOpen.value
    }
  }
})
</script>

<template>
  <UApp :toaster="appConfig.toaster">
    <NuxtLoadingIndicator color="#primary" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- <ClientOnly>
      <AppSearch v-model="isSearchOpen" />
    </ClientOnly> -->
  </UApp>
</template>