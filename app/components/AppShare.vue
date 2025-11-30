<script setup lang="ts">
const props = defineProps<{
  title?: string
  url?: string
}>()

const route = useRoute()
const config = useRuntimeConfig()
const { copy, copied } = useClipboard()
const toast = useToast()

const shareUrl = computed(() => {
  if (props.url) return props.url
  // Fallback to current URL if not provided
  if (process.client) {
    return window.location.href
  }
  return `${config.public.siteUrl}${route.path}`
})

const shareLinks = computed(() => [
  {
    name: 'Facebook',
    icon: 'i-simple-icons-facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`,
    color: 'blue'
  },
  {
    name: 'X (Twitter)',
    icon: 'i-simple-icons-x',
    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title || '')}&url=${encodeURIComponent(shareUrl.value)}`,
    color: 'black'
  },
  {
    name: 'LinkedIn',
    icon: 'i-simple-icons-linkedin',
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`,
    color: 'blue'
  },
  {
    name: 'Zalo',
    icon: 'i-simple-icons-zalo',
    url: `https://zalo.me/share/?url=${encodeURIComponent(shareUrl.value)}`,
    color: 'blue'
  }
])


const copyLink = () => {
  copy(shareUrl.value)
  toast.add({
    title: 'Đã sao chép liên kết',
    icon: 'i-lucide-check-circle',
    color: 'success'
  })
}

const openShare = (url: string) => {
  window.open(url, '_blank', 'width=600,height=400')
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Chia sẻ:</span>

    <div class="flex gap-1">
      <UTooltip v-for="link in shareLinks" :key="link.name" :text="link.name">
        <UButton :icon="link.icon" color="neutral" variant="ghost" size="sm" class="cursor-pointer"
          @click="openShare(link.url)" />
      </UTooltip>

      <UTooltip text="Sao chép liên kết">
        <UButton :icon="copied ? 'i-lucide-check' : 'i-lucide-link'" class="cursor-pointer"
          :color="copied ? 'success' : 'neutral'" variant="ghost" size="sm" @click="copyLink" />
      </UTooltip>
    </div>
  </div>
</template>
