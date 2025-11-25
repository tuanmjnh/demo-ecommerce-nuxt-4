<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const toast = useToast()

const state = reactive({
  username: '',
  password: ''
})

const loading = ref(false)

async function onSubmit() {
  if (!state.username || !state.password) return

  loading.value = true
  try {
    await authStore.login({
      username: state.username,
      password: state.password,
      deviceId: 'web',
      deviceType: 'WEB',
      deviceName: 'Browser'
    })
    
    toast.add({ title: 'Login successful', color: 'green' })
    navigateTo('/admin')
  } catch (error: any) {
    toast.add({ 
      title: 'Login failed', 
      description: error.data?.message || error.message, 
      color: 'red' 
    })
  } finally {
    loading.value = false
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
