import { defineStore } from 'pinia'
export const usePostStore = defineStore('postStore', () => {
  const list = ref<Models.IPost[]>([])
  const detail = ref<Models.IPost | null>(null)
  const related = ref<Models.IPost[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({ page: 1, limit: 10, total: 0 })

  const fetchList = async (params = {}) => {
    loading.value = true
    try {
      const rs = await useAPI<Common.IResponseItems>('/posts', { method: 'GET', query: params })
      list.value = rs.data?.items || []
      pagination.value.total = rs.data?.total || 0
      pagination.value.page = rs.data?.page || 1
      pagination.value.limit = rs.data?.limit || 10
      return rs
    } catch (e: any) {
      error.value = e?.message || 'Failed to load posts'
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchDetailBySlug = async (slugFull: string) => {
    loading.value = true
    try {
      const normalized = slugFull.startsWith('/') ? slugFull.slice(1) : slugFull
      const rs = await useAPI<Common.IResponseItem>(`/posts/detail/${normalized}`, { method: 'GET' })
      detail.value = rs.data
      return rs
    } catch (e) {
      error.value = 'Not found'
      detail.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchRelated = async (id: string, limit = 6) => {
    try {
      const rs = await useAPI<Common.IResponseItems>('/posts', { method: 'GET', query: { page: 1, pageSize: limit } })
      related.value = (rs.data?.items || []).filter((p: Models.IPost) => p._id !== id).slice(0, limit)
    } catch {
      related.value = []
    }
  }

  return { list, detail, related, loading, error, pagination, fetchList, fetchDetailBySlug, fetchRelated }
})
