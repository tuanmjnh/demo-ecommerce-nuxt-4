<script setup lang="ts">
const props = defineProps<{ post: any }>()
console.log(props.post)
</script>

<template>
  <article class="post-card">
    <h3>{{ post.title }}</h3>
    <p>{{ post.desc }}</p>
    <NuxtLink :to="post.slug">{{ post.slug }}</NuxtLink>
  </article>
</template>

<style scoped>
.post-card {
  padding: 12px;
  border-bottom: 1px solid #eee;
}
</style>
