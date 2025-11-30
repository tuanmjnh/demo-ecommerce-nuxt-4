<script setup lang="ts">
const menuState = useMenuState()
const items = computed(() => menuState.uiMenuItems.value)
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

    <template #right>
      <UColorModeButton />
    </template>

    <template #body>
      <!-- Mobile Menu (Tự động dùng chung items đã map) -->
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

      <USeparator class="my-6" />
    </template>
  </UHeader>
</template>
