<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const authState = useAuthState()
const toast = useToast()

const state = reactive({
  username: '',
  password: ''
})

const loading = computed(() => authState.loading.value)

async function onSubmit() {
  if (!state.username || !state.password) return

  try {
    const success = await authState.login({
      username: state.username,
      password: state.password,
      deviceId: 'web',
      deviceType: 'WEB',
      deviceName: 'Browser'
    })

    if (success) {
      toast.add({ title: 'Login successful', color: 'success' })
      navigateTo('/admin')
    } else {
      toast.add({ title: 'Login failed', color: 'error' })
    }
  } catch (error: any) {
    toast.add({
      title: 'Login failed',
      description: error.data?.message || error.message,
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-bold text-center">Login</h1>
      </template>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <UFormGroup label="Username" name="username">
          <UInput v-model="state.username" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit" block :loading="loading">
          Login
        </UButton>
      </form>
    </UCard>
  </div>
</template>
