<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const stats = [{
  label: 'Total Revenue',
  value: '$45,231.89',
  icon: 'i-lucide-dollar-sign',
  trend: '+20.1% from last month'
}, {
  label: 'Subscriptions',
  value: '+2350',
  icon: 'i-lucide-users',
  trend: '+180.1% from last month'
}, {
  label: 'Sales',
  value: '+12,234',
  icon: 'i-lucide-credit-card',
  trend: '+19% from last month'
}, {
  label: 'Active Now',
  value: '+573',
  icon: 'i-lucide-activity',
  trend: '+201 since last hour'
}]
</script>

<template>
  <div class="space-y-8">
    <!-- Stats Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ stat.label }}
          </div>
          <UIcon :name="stat.icon" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ stat.trend }}</span>
        </div>
      </UCard>
    </div>

    <!-- Recent Activity / Charts Placeholder -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <UCard class="col-span-4">
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Overview</h3>
        </template>
        <div class="h-80 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800">
          <span class="text-gray-400">Chart Placeholder</span>
        </div>
      </UCard>

      <UCard class="col-span-3">
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Recent Sales</h3>
        </template>
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center">
            <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="sm" />
            <div class="ml-4 space-y-1">
              <p class="text-sm font-medium leading-none">Olivia Martin</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">olivia.martin@email.com</p>
            </div>
            <div class="ml-auto font-medium">+$1,999.00</div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
