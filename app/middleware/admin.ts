export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  if (!authStore.loggedIn) {
    return navigateTo('/admin/login')
  }

  // Check if user has admin role
  // Assuming 'ADMIN' or 'SUPER_ADMIN' role exists
  const isAdmin = authStore.user?.roles?.some(role => ['ADMIN', 'SUPER_ADMIN'].includes(role))

  if (!isAdmin) {
    return navigateTo('/')
  }
})
