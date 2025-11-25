import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  const user = ref<Models.IUser | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const loggedIn = ref(false)
  const loading = ref(false)

  // --- ACTIONS ---
  async function login(credentials: any) {
    loading.value = true
    try {
      const res = await useAPI<Common.IResponseAuth>('auth/login', {
        method: 'POST',
        body: credentials
      })

      if (res && res.status && res.accessToken) {
        accessToken.value = res.accessToken
        refreshToken.value = res.refreshToken || null
        user.value = res.user || null
        loggedIn.value = true

        // Save token to cookie for SSR
        const tokenCookie = useCookie('token')
        tokenCookie.value = res.accessToken

        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!accessToken.value) return

    try {
      const res = await useAPI<Common.IResponseItem>('auth/me')
      if (res && res.status && res.data) {
        user.value = res.data
        loggedIn.value = true
      } else {
        logout()
      }
    } catch (error) {
      logout()
    }
  }

  function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    loggedIn.value = false

    const tokenCookie = useCookie('token')
    tokenCookie.value = null

    navigateTo('/admin/login')
  }

  return {
    user,
    accessToken,
    refreshToken,
    loggedIn,
    loading,
    login,
    fetchUser,
    logout
  }
}, {
  persist: true
})
