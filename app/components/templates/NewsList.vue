<script setup lang="ts">
// Định nghĩa lại interface cho gọn
interface IPostMapped {
  id: string
  title: string
  slug: string
  image: string
  description: string
  createdAt: string
  category?: string
}

const props = defineProps<{ data?: Models.IGroup }>()
const router = useRouter()
const route = useRoute()

// --- 1. UTILS & STATE ---
// Helper xử lý ảnh (Tái sử dụng)
const optimizeImageUrl = (url?: string, width = 600) => {
  if (!url) return `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=${width}`
  if (url.includes('https://images.unsplash.com')) return url.replace('https://images.unsplash.com', '/unsplashImages')
  return url
}

// Page Sync: Tự động đồng bộ với URL Query
const page = computed({
  get: () => Number(route.query.page) || 1,
  set: (val) => router.push({ query: { ...route.query, page: val } })
})

const limit = ref(9)
const activeCategory = ref('all') // Giữ lại biến này nếu sau này bạn muốn thêm bộ lọc

// --- 2. FETCH GROUPS (Categories) ---
// Dùng để lấy list ID cho bộ lọc bên dưới
const { data: categories } = await useAsyncData(
  `news-groups-${props.data?._id || 'root'}`,
  async () => {
    const filter = {
      limit: 20,
      sort: 'sort',
      key: props.data?.key, // 'news'
      parent: props.data?._id ? [props.data._id] : []
    }
    const res = await useAPI<Common.IResponseItems>('group/public', { method: 'POST', body: filter })
    return res.data?.items || []
  },
  {
    watch: [() => props.data]
  }
)

// --- 3. FETCH MAIN POSTS (Tin tức chính) ---
const { data: postsData, status, refresh } = await useAsyncData(
  () => `news-list-${props.data?._id}-${activeCategory.value}-${page.value}`,
  async () => {
    // Logic gộp ID nhóm
    const groupIds: string[] = []

    // Nếu đang chọn All, gom hết ID của các nhóm con vào
    if (activeCategory.value === 'all') {
      if (props.data?._id) groupIds.push(props.data._id)
      if (categories.value) {
        groupIds.push(...categories.value.map((g: any) => g._id))
      }
    } else {
      groupIds.push(activeCategory.value)
    }

    const filter = {
      limit: limit.value,
      page: page.value,
      sort: '-createdAt',
      key: 'news', // Filter cứng theo news
      groups: groupIds.length ? groupIds : undefined
    }

    const res = await useAPI<Common.IResponseItems>('posts/public', { method: 'POST', body: filter })
    return res.data
  },
  {
    watch: [page, activeCategory, () => props.data], // Tự động fetch khi page đổi
    // Transform dữ liệu ngay tại Server -> Giảm tải cho Client
    transform: (data) => {
      const items = data?.items?.map((post: any): IPostMapped => ({
        id: post._id || '',
        title: post.title,
        slug: post.slug,
        image: optimizeImageUrl(post.image?.url),
        description: post.desc || '',
        createdAt: post.createdAt,
        category: 'Kiến thức' // Bạn có thể map tên group vào đây nếu muốn
      })) || []

      return {
        items,
        total: data?.total || 0
      }
    }
  }
)

// --- 4. FETCH HOT TOPICS (Sidebar) ---
// Tách riêng ra để không ảnh hưởng list chính
const { data: hotPosts } = await useAsyncData('hot-posts-sidebar', async () => {
  const filter = {
    limit: 5,
    sort: '-views',
    key: 'news'
  }
  const res = await useAPI<Common.IResponseItems>('posts/public', { method: 'POST', body: filter })
  return res.data
}, {
  // Transform cho Sidebar
  transform: (data) => {
    return data?.items?.map((post: any) => ({
      id: post._id,
      title: post.title,
      slug: post.slug,
      image: optimizeImageUrl(post.image?.url, 200),
      desc: post.desc
    })) || []
  }
})

// --- 5. UX UTILS ---
const isLoading = computed(() => status.value === 'pending')

const breadcrumbs = computed(() => [
  { label: 'Trang chủ', to: '/', icon: 'i-heroicons-home' },
  { label: 'Tin tức', to: '/tin-tuc' },
])

// Scroll lên đầu khi đổi trang
watch(page, () => {
  if (process.client) {
    const el = document.getElementById('news-top')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})
</script>

<template>
  <div class="w-full min-h-screen pb-20 bg-white dark:bg-gray-900">
    <div class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <UBreadcrumb :items="breadcrumbs" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div id="news-top" class="grid grid-cols-1 lg:grid-cols-12 gap-10">

        <div class="lg:col-span-8">
          <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
            <h1 class="font-display text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-8">
              {{ data?.title || 'Tin tức & Sự kiện' }}
            </h1>
          </Motion>

          <div class="space-y-8 min-h-[400px]">

            <template v-if="isLoading && !postsData?.items.length">
              <div v-for="n in 5" :key="n"
                class="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-100 dark:border-gray-800">
                <USkeleton class="w-full md:w-1/3 aspect-4/3 rounded-xl" />
                <div class="flex-1 space-y-3">
                  <USkeleton class="h-6 w-3/4" />
                  <USkeleton class="h-4 w-full" />
                  <USkeleton class="h-4 w-2/3" />
                  <USkeleton class="h-8 w-32 mt-auto" />
                </div>
              </div>
            </template>

            <div v-else-if="!isLoading && postsData?.items.length === 0" class="py-20 text-center">
              <div class="text-6xl mb-4">📝</div>
              <p class="text-gray-500 dark:text-gray-400">Chưa có bài viết nào.</p>
            </div>

            <template v-else>
              <Motion v-for="(item, index) in postsData?.items" :key="item.id" :initial="{ opacity: 0, y: 20 }"
                :animate="{ opacity: 1, y: 0 }" :transition="{ delay: index * 0.1, duration: 0.5 }"
                class="group flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-100 dark:border-gray-800 last:border-0">

                <ULink :to="`/${item.slug}`" class="w-full md:w-1/3 shrink-0 overflow-hidden rounded-xl">
                  <div class="aspect-4/3 md:aspect-16/10 relative overflow-hidden">
                    <NuxtImg :src="item.image" :alt="item.title" width="320" height="240" fit="cover" format="webp"
                      loading="lazy" :placeholder="10"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                </ULink>

                <div class="flex-1 flex flex-col">
                  <ULink :to="`/${item.slug}`">
                    <h3
                      class="font-display text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-3 line-clamp-2">
                      {{ item.title }}
                    </h3>
                  </ULink>

                  <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                    {{ item.description }}
                  </p>

                  <div class="flex items-center gap-4 mt-auto">
                    <UButton :to="`/${item.slug}`" variant="link" :padded="false" color="primary" label="Xem chi tiết"
                      trailing-icon="i-heroicons-arrow-right-20-solid" class="font-semibold" />
                  </div>
                </div>
              </Motion>
            </template>
          </div>

          <div v-if="postsData && postsData.total > limit" class="mt-12 flex justify-center">
            <UPagination v-model="page" :total="postsData.total" :page-count="limit" :disabled="isLoading" />
          </div>
        </div>

        <div class="lg:col-span-4 space-y-8">
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 sticky top-4">
            <div class="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <UIcon name="i-heroicons-fire" class="w-6 h-6 text-orange-500" />
              <h3 class="font-display text-lg font-bold text-gray-900 dark:text-white uppercase">
                Chủ đề Hot
              </h3>
            </div>

            <div class="space-y-6">
              <template v-if="!hotPosts">
                <div v-for="i in 5" :key="i" class="flex gap-4">
                  <USkeleton class="w-24 h-20 rounded-lg" />
                  <div class="flex-1 space-y-2">
                    <USkeleton class="h-4 w-full" />
                    <USkeleton class="h-3 w-2/3" />
                  </div>
                </div>
              </template>

              <div v-else v-for="(post, index) in hotPosts" :key="post.id" class="group flex gap-4">
                <ULink :to="`/${post.slug}`" class="w-24 h-20 shrink-0 rounded-lg overflow-hidden">
                  <NuxtImg :src="post.image" :alt="post.title" width="128" height="128" fit="cover" format="webp"
                    loading="lazy" :placeholder="10"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </ULink>
                <div class="flex-1">
                  <ULink :to="`/${post.slug}`">
                    <h4
                      class="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
                      {{ post.title }}
                    </h4>
                  </ULink>
                  <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {{ post.desc }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>