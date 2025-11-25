<script setup lang="ts">
// Nuxt tự động import useRoute và useMenuStore (nếu đã config)
// const route = useRoute()
// const menuStore = useMenuStore()
// const { t } = useI18n()
// Gọi store action bên trong useAsyncData
// Để đảm bảo SSR render ra HTML có đầy đủ menu
// const { data, pending, error, status } = await useAsyncData('init-menu', async () => {
//   await menuStore.fetchMenu()
//   return true
// })
// await useAsyncFetch('init-menu', async () => {
//   await menuStore.fetchMenu()
//   return true
// })
//
// 2. Lắng nghe lỗi (Chìa khóa để hiện lỗi SSR)
// watch(error, (err) => {
//   if (err && import.meta.client) useNotify({ type: 'error', title: t('message.error.title'), message: t(`message.${err?.statusMessage}`) })
// }, { immediate: true })
// if (!data.value) {
// throw createError({
//   statusCode: 404,
//   statusMessage: 'Page Not Found',
// })
// }
// Lấy items để render
// if (error) {
// console.error('An error occurred:', error);
// You can display an error message to the user
// or redirect to an error page
// }
const items = computed(() => useMenuStore().uiMenuItems)
// console.log(items.value)
// appStore.notify('testdslkgjsdlg', "test")
// console.log(useNotify({ message: 'dsfsdg', title: 'tuanmjnh', type: 'secondary' }))
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-16 shrink-0" />
      </NuxtLink>
    </template>

    <!-- Desktop Menu -->
    <UNavigationMenu :items="items" variant="link" />
    <!-- {{ error }} -->
    <template #right>
      <UColorModeButton />

      <!-- <UButton icon="i-lucide-log-in" color="neutral" variant="ghost" to="/login" class="lg:hidden" /> -->
      <!-- <UButton label="Sign in" color="neutral" variant="outline" to="/login" class="hidden lg:inline-flex" />
      <UButton label="Sign up" color="neutral" trailing-icon="i-lucide-arrow-right" class="hidden lg:inline-flex"
        to="/signup" /> -->
    </template>

    <template #body>
      <!-- Mobile Menu (Tự động dùng chung items đã map) -->
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

      <USeparator class="my-6" />

      <!-- <UButton label="Sign in" color="neutral" variant="subtle" to="/login" block class="mb-3" />
      <UButton label="Sign up" color="neutral" to="/signup" block /> -->
    </template>
  </UHeader>
</template>
