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

const projects = computed(() => {
  if (!projectsData.value?.items) return []
  return projectsData.value.items.map((post: Models.IPost) => {
    // Resolve category name
    let categoryName = 'Khác'

    let imageUrl = post.image?.url || '/unsplashImages/photo-1618221195710-dd6b41faaea6?w=600'

    // Replace full URLs with aliases for NuxtImg
    if (imageUrl.includes('https://images.unsplash.com')) {
      imageUrl = imageUrl.replace('https://images.unsplash.com', '/unsplashImages')
    } else if (imageUrl.includes('https://plus.unsplash.com')) {
      imageUrl = imageUrl.replace('https://plus.unsplash.com', '/unsplashPlus')
    }

    return {
      id: post._id || '',
      title: post.title,
      category: categoryName,
      // Access image.url from IFileAttach structure
      image: imageUrl,
      description: post.desc || '',
      slug: post.slug
    }
  })
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
    // hash: '#with-links'
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

// Fix: Explicitly refresh when page changes via watcher if needed, 
// but useAsyncData watch option should handle it. 
// However, user reported issue in production.
// Let's add the explicit refresh in the watcher as planned.
watch(() => route.query.page, (newPage) => {
  page.value = Number(newPage) || 1
  refresh()
})
</script>

<template>
  <div class="w-full min-h-screen pb-20">
    <div class="pt-12 pb-8 px-4 sm:px-10 max-w-7xl mx-auto">
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
        <h1 class="font-display text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Dự án của Chúng tôi
        </h1>
        <p class="text-primary-600 dark:text-primary-400 text-lg max-w-2xl leading-relaxed">
          Khám phá những không gian sống đầy cảm hứng được tạo nên bởi đội ngũ kiến trúc sư tài năng.
        </p>
      </Motion>

      <div class="flex flex-wrap gap-3 mt-8">
        <button v-for="cat in categories" :key="cat._id" @click="activeCategory = cat._id"
          class="px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border"
          :class="activeCategory === cat._id
            ? 'bg-primary-500 border-primary-500 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
          {{ cat.title }}
        </button>
      </div>
    </div>

    <div class="px-4 sm:px-10 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-if="filteredProjects.length === 0" class="py-20 text-center">
          <p class="text-gray-500 dark:text-gray-400">Không có dự án nào thuộc danh mục này.</p>
        </div>
        <Motion v-else v-for="(project, index) in filteredProjects" :key="project._id" :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }" :transition="{ delay: index * 0.1, duration: 0.5 }">
          <ProjectCard :project="project" />
        </Motion>
      </div>

      <!-- Pagination -->
      <div v-if="total > limit" class="mt-12 flex justify-center">
        <UPagination v-model:page="page" :total="total" :page-count="limit" :to="to" />
      </div>
    </div>
  </div>
</template>