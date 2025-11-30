export default defineNuxtRouteMiddleware(async (to, from) => {
  const authState = useAuthState()

  // If user is not logged in, try to fetch user details
  if (!authState.loggedIn.value) {
    await authState.fetchUser()
  }

  // If still not logged in, redirect to login page
  if (!authState.loggedIn.value) {
    return navigateTo('/admin/login')
  }
})
