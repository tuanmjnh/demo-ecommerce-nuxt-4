export const useCompanyState = () => {
  const config = useRuntimeConfig()

  // Initialize originUrl
  let originUrl = 'https://website-cua-ban.com'
  try {
    originUrl = useRequestURL().origin
  } catch (e) {
    // Fallback
  }

  const info = useState<Models.ICompany | null>('company-info', () => null)

  const fetchCompany = async () => {
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

  const currentSiteUrl = computed(() => {
    if (config.public.siteUrl) {
      return config.public.siteUrl
    }
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
      url: currentSiteUrl.value,
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
}
