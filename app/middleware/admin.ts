export default defineNuxtRouteMiddleware(async (to, from) => {
  const authState = useAuthState()

  if (!authState.loggedIn.value) {
    await authState.fetchUser()
  }

  if (!authState.loggedIn.value) {
    return navigateTo('/admin/login')
  }
})
