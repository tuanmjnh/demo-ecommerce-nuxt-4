<script setup lang="ts">
const props = defineProps<{ posts: any[] }>()
</script>

<template>
  <div>
    <PostCard v-for="p in props.posts" :key="p._id" :post="p" />
  </div>
</template>
