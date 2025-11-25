<script setup lang="ts">
const links = [{
  label: 'Dashboard',
  icon: 'i-lucide-layout-dashboard',
  to: '/admin'
}, {
  label: 'Products',
  icon: 'i-lucide-package',
  to: '/admin/products'
}, {
  label: 'Orders',
  icon: 'i-lucide-shopping-cart',
  to: '/admin/orders'
}, {
  label: 'Users',
  icon: 'i-lucide-users',
  to: '/admin/users'
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  to: '/admin/settings'
}]
</script>

<template>
  <div class="flex flex-col border-r border-gray-200 dark:border-gray-800 h-screen w-64 bg-white dark:bg-gray-900 sticky top-0">
    <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
      <AppLogo class="h-8 w-auto" />
      <span class="font-bold text-lg">Admin</span>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <UVerticalNavigation :links="links" />
    </div>

    <div class="p-4 border-t border-gray-200 dark:border-gray-800">
      <UButton
        icon="i-lucide-log-out"
        color="gray"
        variant="ghost"
        label="Logout"
        block
        @click="useAuthStore().logout()"
      />
    </div>
  </div>
</template>
