<script setup lang="ts">
const route = useRoute()

const tabs = [
  { label: 'EULA', to: '/' },
  { label: 'Privacy Policy', to: '/privacy' },
]
</script>

<template>
  <div class="page">
    <header class="header">
      <h1 class="logo">Seqman</h1>
      <p class="subtitle">Stepdeq — Legal</p>
    </header>

    <nav class="tabs">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="tab"
        :class="{ active: route.path === tab.to }"
      >
        {{ tab.label }}
      </NuxtLink>
    </nav>

    <main class="content">
      <NuxtPage />
    </main>

    <footer class="footer">
      <p>&copy; {{ new Date().getFullYear() }} Seqman &middot; <a href="mailto:hello@seqman.com">hello@seqman.com</a> &middot; <a href="https://www.seqman.com">www.seqman.com</a></p>
    </footer>
  </div>
</template>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0a0a0a;
  color: #e0e0e0;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

a {
  color: #7c8aff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #1e1e1e;
}

.logo {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
}

.subtitle {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.tabs {
  display: flex;
  gap: 0;
  margin-top: 1.5rem;
  border-bottom: 1px solid #1e1e1e;
}

.tab {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.tab:hover {
  color: #aaa;
  text-decoration: none;
}

.tab.active {
  color: #fff;
  border-bottom-color: #7c8aff;
}

.content {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  padding-top: 1.5rem;
  border-top: 1px solid #1e1e1e;
  text-align: center;
  font-size: 0.8rem;
  color: #444;
}

.footer a {
  color: #555;
}

.footer a:hover {
  color: #7c8aff;
}
</style>
