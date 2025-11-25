<script setup lang="ts">
const appConfig = useAppConfig()
const colorMode = useColorMode()
const menuStore = useMenuStore()
const companyStore = useCompanyStore() // 👇 1. Gọi Store

// Tính toán màu theme cho thanh browser
const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')

// --- 1. Fetch Data ---
await useAsyncData('init-company', async () => {
  await companyStore.fetchCompany()
  return true
})
// Gọi Menu luôn ở đây để đảm bảo Search có dữ liệu
await useAsyncData('init-menu', async () => {
  await menuStore.fetchMenu()
  return true
})

// --- 2. SEO Config ---
useSeoMeta({
  // Tiêu đề mặc định: "Trang con - Tên Công Ty"
  titleTemplate: (titleChunk) => {
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
      // 🟢 SỬA LẠI NHƯ SAU:
      // 1. Đổi 'children' thành 'innerHTML' (Chuẩn HTML Script)
      // 2. Dùng JSON.stringify() vì thẻ script chỉ chứa text, không chứa JS Object
      innerHTML: computed(() => {
        return companyStore.jsonLdSchema
          ? JSON.stringify(companyStore.jsonLdSchema)
          : '' // Trả về chuỗi rỗng nếu chưa có data để tránh lỗi
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