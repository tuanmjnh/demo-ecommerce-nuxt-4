<script setup lang="ts">
const company = computed(() => useCompanyStore().info)
const menuFooter = computed(() => useMenuStore().uiMenuFooter)
</script>
<template>
  <footer class="w-full bg-gray-100 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-10 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4 text-text-light dark:text-text-dark">
            <h2 class="font-display text-lg font-bold">{{ company?.name }} </h2>
          </div>
          <p class="font-body text-sm text-text-light/80 dark:text-text-dark/80">Địa chỉ: {{ company?.address }}
          </p>
          <p class="font-body text-sm text-text-light/80 dark:text-text-dark/80">Hotline: {{ company?.hotline }}</p>
        </div>

        <div class="flex flex-col gap-4">
          <h3 class="font-display font-bold text-text-light dark:text-text-dark">Dịch vụ chính</h3>
          <ul class="space-y-2">
            <li v-for="(item, key) in menuFooter" :key="key">
              <ULink :to="item.url || '#'">{{ item.title }}</ULink>
              <!-- <a href="#" class="font-body text-sm text-text-light/80 hover:text-primary transition-colors">
                {{ item.title }}</a> -->
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-4">
          <h3 class="font-display font-bold text-text-light dark:text-text-dark">Đăng ký tư vấn</h3>
          <form class="flex items-center gap-2" @submit.prevent>
            <input
              class="w-full h-10 px-3 text-sm rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-primary focus:border-primary"
              placeholder="Nhập số điện thoại" type="tel" />
            <button class="h-10 px-4 bg-primary text-white text-sm font-bold rounded-md hover:opacity-90">Gửi</button>
          </form>
        </div>
      </div>
    </div>
  </footer>
</template>