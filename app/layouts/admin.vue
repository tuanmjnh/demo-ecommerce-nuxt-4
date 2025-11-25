<script setup lang="ts">
// Admin Layout
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar (Hidden on mobile, handled by drawer or similar in real app) -->
    <AdminSidebar class="hidden lg:flex" />

    <div class="flex-1 flex flex-col min-w-0">
      <AdminHeader />

      <main class="flex-1 p-4 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
