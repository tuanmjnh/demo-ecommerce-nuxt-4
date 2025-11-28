<script setup lang="ts">
const props = defineProps<{ data?: Models.IGroup }>()

// Fetch all groups to map IDs to Names
const { data: groupsData } = await useAsyncData('groups-list', () => useAPI<Common.IResponseItems>('groups'))
const groupsMap = computed(() => {
  const map: Record<string, string> = {}
  groupsData.value?.data?.items?.forEach((g: any) => {
    if (g._id) map[g._id] = g.title
  })
  return map
})

// Fetch projects from API
const { data: projectsData } = await useAsyncData(`projects-list-${props.data?._id || 'all'}`, async () => {
  const filter: any = {
    limit: 50,
    sort: '-createdAt',
    groups: props.data?._id ? [props.data._id] : undefined
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
    // Resolve category name
    let categoryName = 'Khác'
    if (post.groups && post.groups.length > 0) {
      const firstGroup = post.groups[0]
      if (typeof firstGroup === 'string') {
        categoryName = groupsMap.value[firstGroup] || 'Khác'
      } else if (typeof firstGroup === 'object' && 'title' in firstGroup) {
        categoryName = (firstGroup as any).title
      }
    }

    return {
      id: post._id || '',
      title: post.title,
      category: categoryName,
      // Access image.url from IFileAttach structure
      image: post.image?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600',
      description: post.desc || '',
      slug: post.slug
    }
  })
})

// Extract unique categories from projects
const categories = computed(() => {
  const cats = new Set<string>(['Tất cả'])
  projects.value.forEach((p: any) => {
    if (p.category) cats.add(p.category)
  })
  return Array.from(cats)
})

const activeCategory = ref('Tất cả')

// Logic lọc dự án
const filteredProjects = computed(() => {
  if (activeCategory.value === 'Tất cả') return projects.value
  return projects.value.filter((p: any) => p.category === activeCategory.value)
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
        <button v-for="cat in categories" :key="cat" @click="activeCategory = cat"
          class="px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border"
          :class="activeCategory === cat
            ? 'bg-primary-500 border-primary-500 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
          {{ cat }}
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
    </div>
  </div>
</template>