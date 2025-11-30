<script setup lang="ts">
const appConfig = useAppConfig()
const colorMode = useColorMode()
const menuState = useMenuState()
const companyState = useCompanyState()

// Tính toán màu theme cho thanh browser
const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

// --- 1. Fetch Data ---
const { error: fetchError } = await useAsyncData('global-data', async () => {
  const [menuRes, companyRes] = await Promise.all([
    useAPI<Common.IResponseItem>('menu/public'),
    useAPI<Common.IResponseItem>('company/public')
  ])

  if (menuRes?.data) menuState.flatItems.value = menuRes.data
  if (companyRes?.data) companyState.info.value = companyRes.data
  console.log(companyState.info.value)
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
      ? `${titleChunk} - ${companyState.companyName.value}`
      : companyState.companyName.value
  },

  // Mô tả lấy từ SEO config của công ty hoặc fallback
  description: () => companyState.info.value?.seo?.desc || `Trang chủ ${companyState.companyName.value}`,

  // Open Graph (Facebook/Zalo)
  ogTitle: () => companyState.companyName.value,
  ogDescription: () => companyState.info.value?.seo?.desc,
  // Ưu tiên lấy ảnh Banner, nếu không có thì lấy Logo
  ogImage: () => companyState.info.value?.banner?.url || companyState.logoUrl.value,

  // Twitter
  twitterCard: 'summary_large_image',
  twitterImage: () => companyState.info.value?.banner?.url || companyState.logoUrl.value,
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
        return companyState.jsonLdSchema.value
          ? JSON.stringify(companyState.jsonLdSchema.value)
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