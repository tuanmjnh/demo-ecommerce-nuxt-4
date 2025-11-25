<script setup lang="ts">
defineProps<{ post: any }>()
</script>

<template>
  <article class="post-card">
    <h3>{{ post.title }}</h3>
    <p>{{ post.desc }}</p>
    <NuxtLink :to="post.slugFull">{{ post.slugFull }}</NuxtLink>
  </article>
</template>

<style scoped>
.post-card {
  padding: 12px;
  border-bottom: 1px solid #eee;
}
</style>
