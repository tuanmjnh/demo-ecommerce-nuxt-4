// composables/useAsyncFetch.ts
import type { AsyncDataOptions } from 'nuxt/app'
interface CustomAsyncOptions<T> extends AsyncDataOptions<T> {
  showErrorToast?: boolean
}
export const useAsyncFetch = <T>(
  key: string,
  handler: () => Promise<T>,
  options: CustomAsyncOptions<T> = {}
) => {
  const { t } = useI18n() // Use i18n to translate errors
  const { showErrorToast = true, ...nuxtOptions } = options
  // 1. Call the original useAsyncData
  const result = useAsyncData<T>(key, handler, nuxtOptions)
  const { error } = result

  // 2. Centralized error handling logic
  watch(error, (newError) => {
    // Only show notification when staying Client and there is a real error
    if (import.meta.client && newError && showErrorToast) {

      // Get the message key to translate (priority statusMessage, fallback to message)
      // Example server returns: { statusMessage: 'error.tokenExpired' }
      const errorKey = newError.statusMessage || newError.message || 'error.unknown'

      // Show Toast
      useNotify({
        type: 'error', // Type: error
        message: t(`message.${errorKey}`), // Content: message.error.tokenExpired
        title: t('message.error.title') // Title: Error
      })

      // (Optional) Clear the error after displaying to avoid displaying it again if the component re-mounts
      // clearError()
    }
  }, { immediate: true }) // Important: immediate to catch errors from SSR

  // 3. Return the same result of useAsyncData
  return result
}
