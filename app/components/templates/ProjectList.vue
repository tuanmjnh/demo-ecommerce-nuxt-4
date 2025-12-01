<script setup lang="ts">
// Định nghĩa lại Type cho rõ ràng (Nếu bạn đã có file types riêng thì import vào)
interface IProjectMapped {
  id: string
  title: string
  category: string
  image: string
  description: string
  slug: string
}

const props = defineProps<{ data?: Models.IGroup }>()
const router = useRouter()
const route = useRoute()

// --- 1. STATE MANAGEMENT ---
// Dùng computed cho page để đồng bộ 2 chiều với URL -> Chuẩn SEO và Share link
const page = computed({
  get: () => Number(route.query.page) || 1,
  set: (val) => router.push({ query: { ...route.query, page: val } })
})
const limit = ref(9)
const activeCategory = ref('all')

// Hàm helper xử lý URL ảnh (Tách ra cho gọn code chính)
const optimizeImageUrl = (url?: string) => {
  if (!url) return '/unsplashImages/photo-1618221195710-dd6b41faaea6?w=600'
  if (url.includes('https://images.unsplash.com')) return url.replace('https://images.unsplash.com', '/unsplashImages')
  if (url.includes('https://plus.unsplash.com')) return url.replace('https://plus.unsplash.com', '/unsplashPlus')
  return url
}

// --- 2. FETCH GROUPS (Danh mục) ---
const { data: categories } = await useAsyncData(
  `groups-list-${props.data?._id || 'root'}`,
  async () => {
    const filter = {
      limit: 20, // Tăng limit lên chút để lấy hết category
      sort: 'sort',
      key: props.data?.key,
      parent: props.data?._id ? [props.data._id] : []
    }
    const res = await useAPI<Common.IResponseItems>('group/public', { method: 'POST', body: filter })

    // Transform ngay tại đây: Tạo mảng category hoàn chỉnh
    const items = res.data?.items || []
    return [
      { title: 'Tất cả', _id: 'all' },
      ...items
    ]
  },
  {
    watch: [() => props.data], // Fetch lại nếu props thay đổi
    default: () => [{ title: 'Tất cả', _id: 'all' }] // Giá trị mặc định tránh lỗi undefined
  }
)

// --- 3. FETCH PROJECTS (Dự án) ---
const { data: projectsData, status, refresh } = await useAsyncData(
  () => `projects-${props.data?._id}-${activeCategory.value}-${page.value}`,
  async () => {
    // Logic tính toán Group IDs
    const groupIds: string[] = []
    if (activeCategory.value === 'all') {
      if (props.data?._id) groupIds.push(props.data._id)
      // Lấy ID từ danh sách category đã load ở trên
      if (categories.value) {
        // Lọc bỏ item 'all' ra
        const subCats = categories.value.filter(c => c._id !== 'all')
        groupIds.push(...subCats.map((c: any) => c._id))
      }
    } else {
      groupIds.push(activeCategory.value)
    }

    const filter = {
      limit: limit.value,
      page: page.value,
      sort: '-createdAt',
      groups: groupIds.length ? groupIds : undefined
    }

    const res = await useAPI<Common.IResponseItems>('posts/public', { method: 'POST', body: filter })
    return res.data
  },
  {
    watch: [page, activeCategory, () => props.data],
    // TỐI ƯU CỰC MẠNH: Transform dữ liệu ngay từ Server/API call
    // Giúp giảm gánh nặng tính toán cho Client mỗi lần render
    transform: (data) => {
      const items = data?.items?.map((post: any): IProjectMapped => ({
        id: post._id || '',
        title: post.title,
        category: 'Khác', // Nếu backend có trả về group name thì map vào đây
        image: optimizeImageUrl(post.image?.url),
        description: post.desc || '',
        slug: post.slug
      })) || []

      return {
        items,
        total: data?.total || 0
      }
    }
  }
)

// --- 4. UX & SCROLL LOGIC ---
// Khi đổi category -> Reset về trang 1
watch(activeCategory, () => {
  if (page.value !== 1) page.value = 1
})

// Khi page thay đổi -> Scroll nhẹ lên đầu list để user dễ xem
watch(page, () => {
  if (process.client) {
    const el = document.getElementById('project-list-top')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})

// Kiểm tra trạng thái đang tải
const isLoading = computed(() => status.value === 'pending')
</script>

<template>
  <div class="w-full min-h-screen pb-20">
    <div id="project-list-top" class="pt-12 pb-8 px-4 sm:px-10 max-w-7xl mx-auto">
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
        <h1 class="font-display text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Dự án của Chúng tôi
        </h1>
        <p class="text-primary-600 dark:text-primary-400 text-lg max-w-2xl leading-relaxed">
          Khám phá những không gian sống đầy cảm hứng được tạo nên bởi đội ngũ kiến trúc sư tài năng.
        </p>
      </Motion>

      <div class="flex flex-wrap gap-3 mt-8">
        <template v-if="!categories || categories.length === 1">
          <USkeleton v-for="i in 4" :key="i" class="h-9 w-24 rounded-full" />
        </template>

        <button v-else v-for="cat in categories" :key="cat._id" @click="activeCategory = cat._id"
          class="px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          :class="activeCategory === cat._id
            ? 'bg-primary-500 border-primary-500 text-white shadow-lg scale-105'
            : 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'">
          {{ cat.title }}
        </button>
      </div>
    </div>

    <div class="px-4 sm:px-10 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">

        <template v-if="isLoading && !projectsData?.items?.length">
          <div v-for="n in 6" :key="n" class="space-y-4">
            <USkeleton class="h-64 w-full rounded-xl" />
            <USkeleton class="h-6 w-3/4" />
            <USkeleton class="h-4 w-1/2" />
          </div>
        </template>

        <div v-else-if="!isLoading && projectsData?.items.length === 0" class="col-span-full py-20 text-center">
          <div class="mb-4 text-6xl">📂</div>
          <p class="text-gray-500 dark:text-gray-400 text-lg">Chưa có dự án nào thuộc danh mục này.</p>
        </div>

        <template v-else>
          <Motion v-for="(project, index) in projectsData?.items" :key="project.id" :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }" :transition="{ delay: index * 0.05, duration: 0.4 }">
            <ProjectCard :project="project" />
          </Motion>
        </template>
      </div>

      <div v-if="projectsData && projectsData.total > limit" class="mt-12 flex justify-center">
        <UPagination v-model:page="page" :total="projectsData.total" :page-count="limit" :disabled="isLoading" />
      </div>
    </div>
  </div>
</template>