<script setup lang="ts">
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
type PopulatedPost = Omit<Models.IPost, 'groups'> & { groups: Models.IGroup[] }
const props = defineProps<{
  data?: PopulatedPost
}>()
const content = await parseMarkdown(props.data?.content || '')
</script>

<template>
  <UContainer>
    <UPageHeader :title="data?.title">
      <!-- <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {{ data?.title }}
      </h1> -->
    </UPageHeader>
    <UPage>
      <UPageBody>
        <!-- <div class="prose dark:prose-invert max-w-none" v-html="data?.content"/> -->
        <ContentRenderer v-if="content" :value="content" class="prose" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
