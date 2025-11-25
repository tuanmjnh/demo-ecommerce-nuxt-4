// composables/useAsyncAPI.ts
import type { AsyncDataOptions } from 'nuxt/app'

export const useAsyncAPI = <T>(
  key: string,
  url: string | (() => string),
  options: AsyncDataOptions<T> = {}
) => {
  const { t } = useI18n() // Use i18n to translate errors
  // 1. Call useAsyncData wrapper useAPI
  const { data, error, refresh, status, execute } = useAsyncData<T>(key, async () => {
    // Handle dynamic URL (if passed in as function)
    const apiPath = typeof url === 'function' ? url() : url
    // Call useAPI (our basic fetch function)
    return await useAPI<T>(apiPath)
  }, options)

  // 2. "Sync Error" mechanism: Listen for errors from SSR or Client
  // Use watch with immediate: true to catch the error just hydrated from the Server
  watch(error, (newError) => {
    if (newError) {
      // Only show Toast when on Client
      if (import.meta.client) {
        // Get message from error object that useAPI threw
        const msg = newError.message || 'An error occurred'
        // Show Toast
        useNotify({
          type: 'error', // Type: error
          message: t(`message.${msg}`), // Content: message.error.tokenExpired
          title: t('message.error.title') // Title: Error
        })
      }
    }
  }, { immediate: true })

  return { data, error, refresh, status, execute }
}
