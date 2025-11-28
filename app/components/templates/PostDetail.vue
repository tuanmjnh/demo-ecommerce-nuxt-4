<script setup lang="ts">
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

type PopulatedPost = Omit<Models.IPost, 'groups'> & { groups: Models.IGroup[] }
const props = defineProps<{ data: PopulatedPost }>()

// console.log(props.data)
// Fetch related posts

const { data: relatedPosts } = await useAsyncData(`related-posts-${props.data?._id}`, async () => {
  if (!props.data?._id) return []
  const filter = {
    limit: 5,
    sort: '-createdAt',
    groups: props.data.groups.map((g: any) => g._id)
  }
  const response = await useAPI<Common.IResponseItems>('posts/public', { method: 'POST', body: filter })
  return response.data?.items || []
}, {
  default: () => []
})

const { data: pinnedPosts } = await useAsyncData(`pinned-posts-${props.data?._id}`, async () => {
  if (!props.data?._id) return []
  const filter = {
    limit: 5,
    sort: '-createdAt',
    groups: props.data.groups.length > 0 ? props.data.groups.map((g: any) => g._id) : null,
    pins: ['POST_FEATURED']
  }
  const response = await useAPI<Common.IResponseItems>('posts/public', { method: 'POST', body: filter })
  return response.data?.items || []
}, {
  default: () => []
})

const content = await parseMarkdown(props.data?.content || '')

useSeoMeta({
  title: () => props.data?.title,
  description: () => props.data?.desc,
  ogTitle: () => props.data?.title,
  ogDescription: () => props.data?.desc,
  ogImage: () => props.data?.image?.url,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <UContainer>
    <UPageHeader :title="data?.title">
      <template #headline>
        <UBadge :label="data?.author || 'Admin'" color="primary" variant="subtle" />
        <span class="text-muted">&middot;</span>
        <time class="text-muted">{{ new Date(data?.publishedAt || Date.now()).toLocaleDateString() }}</time>
      </template>
      <ULink v-for="category in data?.groups" :key="category._id" raw :to="category.slug" active-class="font-bold"
        inactive-class="text-muted">
        <UBadge :label="category.title" color="secondary" variant="subtle" />
      </ULink>
    </UPageHeader>

    <UPage>
      <UPageBody>
        <ContentRenderer v-if="content" :value="content" class="prose" />
      </UPageBody>
      <div :class="relatedPosts.length > 0 && pinnedPosts.length > 0 ? 'grid grid-cols-1 lg:grid-cols-2 gap-x-8' : ''">
        <PostLinks :posts="relatedPosts" title="Bài viết liên quan" />
        <PostLinks :posts="pinnedPosts" title="Bài viết nổi bật" />
      </div>
    </UPage>
  </UContainer>
</template>
