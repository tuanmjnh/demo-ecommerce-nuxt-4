<script setup lang="ts">
const items = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }]
]
</script>

<template>
  <header class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4 sticky top-0 z-50">
    <div class="flex items-center gap-4">
      <!-- Mobile Menu Button (Visible on small screens) -->
      <UButton
        icon="i-lucide-menu"
        color="gray"
        variant="ghost"
        class="lg:hidden"
      />
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
    </div>

    <div class="flex items-center gap-4">
      <UColorModeButton />
      <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
      </UDropdown>
    </div>
  </header>
</template>
