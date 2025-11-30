export const useAuthState = () => {
  const user = useState<Models.IUser | null>('auth-user', () => null)
  const accessToken = useState<string | null>('auth-access-token', () => null)
  const refreshToken = useState<string | null>('auth-refresh-token', () => null)
  const loggedIn = useState<boolean>('auth-logged-in', () => false)
  const loading = useState<boolean>('auth-loading', () => false)

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
    if (!accessToken.value) {
      // Try to recover from cookie if state is empty (e.g. hard refresh)
      const tokenCookie = useCookie('token')
      if (tokenCookie.value) {
        accessToken.value = tokenCookie.value
      } else {
        return
      }
    }

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
}
