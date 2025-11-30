<script setup lang="ts">
const props = defineProps<{ data?: Models.IGroup }>()

// Fetch all groups to map IDs to Names
const { data: groupsData } = await useAsyncData('groups-list', async () => {
  const filter: any = {
    limit: 9,
    sort: 'sort',
    key: props.data?.key,
    parent: props.data?._id ? [props.data._id] : []
  }
  const response = await useAPI<Common.IResponseItems>('group/public', {
    method: 'POST',
    body: filter
  })
  return response.data
})


const router = useRouter()
const route = useRoute()
const activeCategory = ref('all')
const page = ref(Number(route.query.page) || 1)
const limit = ref(9)

// Sync page with route query
watch(() => route.query.page, (newPage) => {
  page.value = Number(newPage) || 1
})

// Fetch projects from API
const { data: projectsData, refresh } = await useAsyncData(`projects-list-${props.data?._id || 'all'}`, async () => {
  const groupIds = []
  if (activeCategory.value === 'all') {
    if (props.data?._id) groupIds.push(props.data._id)
    if (groupsData.value?.items) {
      groupIds.push(...groupsData.value.items.map((g: any) => g._id))
    }
  } else {
    groupIds.push(activeCategory.value)
  }

  const filter: any = {
    limit: limit.value,
    page: page.value,
    sort: '-createdAt',
    key: 'news',
    groups: groupIds.length ? groupIds : undefined
  }

  const response = await useAPI<Common.IResponseItems>('posts/public', {
    method: 'POST',
    body: filter
  })
  return response.data
}, {
  watch: [page, activeCategory]
})

// Fetch Hot Topics
const { data: hotPostsData } = await useAsyncData('hot-posts-list', async () => {
  const filter: any = {
    limit: 5,
    sort: '-views', // Assuming views or just random/latest for now if views not available
    key: 'news' // Or 'news' depending on requirement, using 'post' or 'news' broadly
  }
  const response = await useAPI<Common.IResponseItems>('posts/public', {
    method: 'POST',
    body: filter
  })
  return response.data
})

const projects = computed(() => {
  if (!projectsData.value?.items) return []
  return projectsData.value.items.map((post: Models.IPost) => {
    return {
      id: post._id || '',
      title: post.title,
      category: 'Kiến thức', // Placeholder or derive from group
      image: post.image?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600',
      description: post.desc || '',
      slug: post.slug,
      createdAt: post.createdAt
    }
  })
})

const hotPosts = computed(() => {
  if (!hotPostsData.value?.items) return []
  return hotPostsData.value.items.map((post: Models.IPost) => ({
    id: post._id,
    title: post.title,
    slug: post.slug,
    image: post.image?.url,
    desc: post.desc
  }))
})

const total = computed(() => projectsData.value?.total || 0)

// Extract unique categories from projects
const categories = computed(() => {
  const cats = [{ title: 'Tất cả', _id: 'all' }]
  if (groupsData.value?.items) {
    cats.push(...groupsData.value.items)
  }
  return cats
})

function to(page: number) {
  return {
    query: { page },
  }
}

// Logic lọc dự án
const filteredProjects = computed(() => {
  return projects.value
})

// Reset page when category changes
watch(activeCategory, () => {
  if (page.value !== 1) {
    router.push({ query: { ...route.query, page: 1 } })
  }
})

// Fix: Explicitly refresh when page changes via watcher
watch(() => route.query.page, (newPage) => {
  page.value = Number(newPage) || 1
  refresh()
})

const breadcrumbs = computed(() => [
  { label: 'Trang chủ', to: '/', icon: 'i-heroicons-home' },
  { label: 'Tin tức', to: '/tin-tuc' },
  // { label: props.data?.title || 'Danh sách', to: route.path }
])
</script>

<template>
  <div class="w-full min-h-screen pb-20 bg-white dark:bg-gray-900">
    <!-- Breadcrumb -->
    <div class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <UBreadcrumb :items="breadcrumbs" />
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Main Content -->
        <div class="lg:col-span-8">
          <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
            <h1 class="font-display text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-8">
              {{ data?.title || 'Tin tức & Sự kiện' }}
            </h1>
          </Motion>

          <div class="space-y-8">
            <div v-if="filteredProjects.length === 0" class="py-20 text-center">
              <p class="text-gray-500 dark:text-gray-400">Không có bài viết nào.</p>
            </div>

            <Motion v-else v-for="(item, index) in filteredProjects" :key="item.id" :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }" :transition="{ delay: index * 0.1, duration: 0.5 }"
              class="group flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-100 dark:border-gray-800 last:border-0">

              <!-- Image -->
              <ULink :to="`/${item.slug}`" class="w-full md:w-1/3 shrink-0 overflow-hidden rounded-xl">
                <div class="aspect-4/3 md:aspect-16/10 relative overflow-hidden">
                  <!-- <img :src="item.image" :alt="item.title"
                    class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" /> -->
                  <NuxtImg :src="item.image" :alt="item.title" width="320" height="240" fit="cover" format="webp"
                    loading="lazy" :placeholder="10" zoom
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              </ULink>

              <!-- Content -->
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
          </div>

          <!-- Pagination -->
          <div v-if="total > limit" class="mt-12 flex justify-center">
            <UPagination v-model:page="page" :total="total" :page-count="limit" :to="to" />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-4 space-y-8">
          <!-- Hot Topics -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700">
            <div class="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <UIcon name="i-heroicons-fire" class="w-6 h-6 text-orange-500" />
              <h3 class="font-display text-lg font-bold text-gray-900 dark:text-white uppercase">
                Chủ đề Hot
              </h3>
            </div>

            <div class="space-y-6">
              <div v-for="(post, index) in hotPosts" :key="post.id" class="group flex gap-4">
                <ULink :to="`/${post.slug}`" class="w-24 h-20 shrink-0 rounded-lg overflow-hidden">
                  <!-- <img :src="post.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200'"
                    class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" /> -->
                  <NuxtImg :src="post.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200'"
                    :alt="post.title" width="128" height="128" fit="cover" format="webp" loading="lazy"
                    :placeholder="10" zoom
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

          <!-- Categories/Tags could go here -->
        </div>
      </div>
    </div>
  </div>
</template>