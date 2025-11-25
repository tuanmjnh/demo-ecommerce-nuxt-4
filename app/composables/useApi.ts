// composables/useAPI.ts
// import { useAppStore } from '~/app/stores/app'
// import type { UseFetchOptions } from 'nuxt/app'
// import type { NitroFetchOptions } from 'nitropack'

// export const useApi = () => {
//   const config = useRuntimeConfig()
//   const token = useCookie('token')

//   // wrapper common
//   const request = async <T>(url: string, opts: any = {}): Promise<T> => {
//     return await $fetch<T>(url, {
//       baseURL: config.public.apiBase,
//       headers: {
//         Authorization: token.value ? `Bearer ${token.value}` : '',
//         ...opts.headers
//       },
//       ...opts
//     })
//   }

//   return { request }
// }

export const useAPI = <T>(url: string, options: any = {}) => {
  const config = useRuntimeConfig()
  // const appStore = useAppStore()
  // const { t } = useI18n()

  return $fetch<T>(url, {
    baseURL: config.public.apiBase,
    ...options,

    onRequest({ options }) {
      const accessToken = useCookie('access_token').value
      if (accessToken) {
        const headers = new Headers(options.headers)
        // headers.set('Authorization', `Bearer ${accessToken}`)
        headers.set('x-access-token', `Bearer ${accessToken}`)
        options.headers = headers
      }
    },

    // onResponseError({ response }) {
    //   // console.log(response)
    //   const errorData = response._data
    //   const message = errorData?.message || 'Server connection error'
    //   // console.log(message)
    //   // if (import.meta.client) app.notifyError(message)
    //   throw createError({
    //     statusCode: response.status,
    //     statusMessage: response.statusText,
    //     message,
    //     data: errorData
    //   })
    // }
    // async onResponseError({ response }) {
    //   const errorData = response._data
    //   const message =
    //     errorData?.message ||
    //     errorData?.error ||
    //     response.statusText ||
    //     'Lỗi kết nối máy chủ'

    //   // GỬI TOAST — chỉ client
    //   if (import.meta.client) {
    //     app.notifyError(message)
    //   }

    //   // SSR: không throw lỗi
    //   if (import.meta.server) {
    //     return response._data
    //   }

    //   // Client: throw → component bắt được
    //   throw createError({
    //     statusCode: response.status,
    //     message,
    //     data: response._data
    //   })
    // }

    onResponseError({ response }) {
      const data = response._data
      // if (import.meta.client) {
      //   appStore.notifyError(t(`message.${data?.statusMessage}` || 'message.error.network'))
      // }

      // SSR: không throw lỗi
      // if (import.meta.server) {
      //   return response._data
      // }
      // console.log(data)
      throw createError({
        statusCode: response.status,
        statusMessage: data?.statusMessage || 'error.network',
        message: data?.message || '',
        data
      })
    }
  })
}
