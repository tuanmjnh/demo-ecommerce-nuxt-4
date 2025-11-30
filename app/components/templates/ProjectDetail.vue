<script setup lang="ts">
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

const companyState = useCompanyState()
const company = computed(() => companyState.info.value)

const props = defineProps<{ data?: any }>()

const content = await parseMarkdown(props.data?.content || '')

// Lấy thông tin dự án dựa trên ID từ URL
const project = computed(() => {
  if (props.data) {
    const p = props.data as Models.IPost

    return {
      ...p,
      ...content?.data, // Merge frontmatter data

      // Transform main image URL
      image: p.image ? {
        ...p.image,
        url: p.image.url?.replace('https://images.unsplash.com', '/unsplashImages')
          .replace('https://plus.unsplash.com', '/unsplashPlus')
      } : undefined,

      // Transform gallery images URLs
      images: p.images?.map(img => ({
        ...img,
        url: img.url?.replace('https://images.unsplash.com', '/unsplashImages')
          .replace('https://plus.unsplash.com', '/unsplashPlus')
      })) || [],
    }
  }

  return null
})
</script>

<template>
  <div v-if="project" class="w-full pb-20">

    <div class="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-10"></div>

      <Motion class="w-full h-full" :initial="{ scale: 1.1 }" :animate="{ scale: 1 }" :transition="{ duration: 1.5 }">
        <!-- <img :src="project.image?.url" class="w-full h-full object-cover" /> -->
        <NuxtImg v-if="project.image?.url" :src="project.image.url" :alt="project.title" width="1264" height="643"
          fit="cover" format="webp" loading="lazy" :placeholder="10"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </Motion>

      <div class="absolute bottom-0 left-0 w-full z-20 p-6 md:p-16 max-w-7xl mx-auto">
        <Motion tag="h1"
          class="text-white font-display text-3xl md:text-5xl font-bold leading-tight max-w-4xl drop-shadow-lg"
          :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.3 }">
          {{ project.title }}
        </Motion>
      </div>
    </div>

    <div v-if="project.meta?.length" class="max-w-5xl mx-auto px-4 -mt-10 relative z-30">
      <div
        class="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-5 gap-6 border border-gray-100 dark:border-gray-800">
        <div v-for="(attr, index) in project.meta" :key="index" class="text-center md:text-left">
          <p class="text-xs font-bold text-gray-400 uppercase mb-1">{{ attr.key }}</p>
          <p class="font-display font-semibold text-gray-900 dark:text-white">{{ attr.value || 'Liên hệ' }}</p>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <AppShare :title="project.title" />
      </div>

    </div>

    <div class="max-w-4xl mx-auto px-4 mt-16 space-y-16">

      <Motion class="space-y-4" :initial="{ opacity: 0, y: 20 }" :while-in-view="{ opacity: 1, y: 0 }"
        :in-view-options="{ once: true }">
        <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Giới thiệu chung & Yêu cầu gia chủ
        </h2>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
          {{ project.desc }}
        </p>
        <!-- Render main content if available -->
        <ContentRenderer v-if="content" :value="content" class="prose dark:prose-invert max-w-none mt-4" />
      </Motion>
    </div>

    <div v-if="project.images && project.images.length > 0" class="max-w-7xl mx-auto px-4 mt-20">
      <h2 class="font-display text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        Khám phá các góc nhìn khác
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div v-for="(img, idx) in project.images" :key="idx" class="overflow-hidden rounded-xl">
          <Motion class="h-full" :initial="{ opacity: 0, y: 20 }" :while-in-view="{ opacity: 1, y: 0 }"
            :transition="{ delay: idx * 0.1 }" :in-view-options="{ once: true }">
            <NuxtImg :src="img.url" :alt="img.display_name" width="616" height="347" fit="cover" format="webp"
              loading="lazy" :placeholder="10" zoom
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </Motion>
        </div>
      </div>
    </div>

    <div class="mt-24 bg-gray-100 dark:bg-gray-800 py-16">
      <div class="max-w-3xl mx-auto text-center px-4 space-y-6">
        <h2 class="font-display text-3xl font-bold text-gray-900 dark:text-white">
          Bạn ấn tượng với phong cách này?
        </h2>
        <p class="text-gray-600 dark:text-gray-300 text-lg">
          Hãy để chúng tôi biến ngôi nhà trong mơ của bạn thành hiện thực. Liên hệ ngay để nhận được tư vấn chuyên sâu.
        </p>
        <div class="flex justify-center gap-4">
          <UButton size="xl" color="primary" class="rounded-lg px-8 py-3 font-bold" label="Nhận tư vấn miễn phí"
            :to="`https://zalo.me/${company?.hotline}`" target="_blank" />
          <UButton size="xl" variant="outline" color="neutral" class="rounded-lg px-8 py-3 font-bold"
            label="Gọi Hotline" trailing-icon="i-lucide-phone" :to="`tel:${company?.hotline}`" />
        </div>
      </div>
    </div>
  </div>
</template>