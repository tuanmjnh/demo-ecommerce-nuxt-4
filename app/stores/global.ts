export const useGlobalStore = defineStore('global', () => {
  // --- 1. STATE (tương đương state: () => ({...})) ---
  // Thay vì companyState.info hay menuState.flatItems, ta gom vào đây
  const menuItems = ref<any[]>([])
  const companyInfo = ref<any>(null)

  // --- 2. GETTERS (tương đương getters: {...}) ---
  // Dùng computed để tự động tính toán lại khi state thay đổi

  const companyName = computed(() => {
    return companyInfo.value?.name || 'Công Ty Mặc Định'
  })

  const logoUrl = computed(() => {
    return companyInfo.value?.logo?.url || ''
  })

  const bannerUrl = computed(() => {
    return companyInfo.value?.banner?.url || logoUrl.value
  })

  const seoDescription = computed(() => {
    return companyInfo.value?.seo?.desc || `Trang chủ ${companyName.value}`
  })

  // Schema JSON-LD cho Google
  const jsonLdSchema = computed(() => {
    if (!companyInfo.value) return null
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": companyName.value,
      "url": "https://website-cua-ban.com",
      "logo": logoUrl.value
    }
  })

  // --- 3. ACTIONS (tương đương actions: {...}) ---
  // Hàm thường để cập nhật state
  function setGlobalData(menu: any[], company: any) {
    menuItems.value = menu
    companyInfo.value = company
  }

  // --- 4. RETURN ---
  // Phải return tất cả những gì bạn muốn dùng ở component
  return {
    menuItems,
    companyInfo,
    companyName,
    logoUrl,
    bannerUrl,
    seoDescription,
    jsonLdSchema,
    setGlobalData
  }
})