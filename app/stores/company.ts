import { defineStore } from 'pinia'

export const useCompanyStore = defineStore('companyStore', () => {
  // --- 1. GỌI COMPOSABLE Ở ĐÂY (SAFE ZONE) ---
  // Gọi ngay lúc khởi tạo store, context đang tồn tại
  const config = useRuntimeConfig()

  // Lấy URL từ request ngay lúc setup luôn (để tránh gọi lại trong computed)
  let originUrl = 'https://website-cua-ban.com'
  try {
    originUrl = useRequestURL().origin
  } catch (e) {
    // Fallback nếu chạy ở môi trường không có request context
  }

  // --- STATE ---
  const info = ref<Models.ICompany | null>(null)

  // --- ACTIONS ---
  async function fetchCompany() {
    if (info.value?._id) return
    try {
      const res = await useAPI<Common.IResponseItem>('company/public')
      if (res?.data) {
        info.value = res.data
      }
    } catch (err) {
      // Silent error
    }
  }

  // --- GETTERS ---
  const currentSiteUrl = computed(() => {
    // Ưu tiên config cứng (Production)
    if (config.public.siteUrl) {
      return config.public.siteUrl
    }
    // Fallback về URL tự động detect
    return originUrl
  })

  const logoUrl = computed(() => info.value?.logo?.url || '/images/default-logo.png')
  const companyName = computed(() => info.value?.name || 'Loading...')
  const socialLinks = computed(() => info.value?.social || {})

  const jsonLdSchema = computed(() => {
    if (!info.value) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: info.value.name,
      url: currentSiteUrl.value, // Dùng giá trị đã tính toán
      logo: logoUrl.value,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: info.value.phone,
        contactType: 'customer service'
      },
      address: info.value.address
    }
  })

  return {
    info,
    fetchCompany,
    logoUrl,
    companyName,
    socialLinks,
    jsonLdSchema,
    currentSiteUrl
  }
})//, {
//  persist: true
//})