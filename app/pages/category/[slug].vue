<script setup lang="ts">
const postStore = usePostStore()
const route = useRoute()
const slug = route.params.slug

await postStore.fetchList({ page: 1, pageSize: 12, group: slug })
</script>

<template>
  <PostList :posts="postStore.list" />
</template>
