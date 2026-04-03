<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path('/documentation').first()
})
</script>

<template>
  <article class="legal">
    <ContentRenderer v-if="page" :value="page" />
    <p v-else>Loading...</p>
  </article>
</template>
