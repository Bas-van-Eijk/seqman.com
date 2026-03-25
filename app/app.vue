<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const showClose = computed(() => route.path === '/eula' || route.path === '/privacy')

function close() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const trailCount = 4
const trailEls = ref<HTMLElement[]>([])
const glowVisible = ref(false)

let mouseX = 0
let mouseY = 0
let rafId = 0

const trails = Array.from({ length: trailCount }, () => ({ x: 0, y: 0 }))
const easings = [0.06, 0.035, 0.02, 0.012]

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY

  const target = e.target as HTMLElement
  glowVisible.value = !!(target.closest('a') || target.closest('.header') || target.closest('.coming-soon'))
}

function animate() {
  for (let i = 0; i < trailCount; i++) {
    const target = i === 0 ? { x: mouseX, y: mouseY } : trails[i - 1]
    trails[i].x += (target.x - trails[i].x) * easings[i]
    trails[i].y += (target.y - trails[i].y) * easings[i]

    const el = trailEls.value[i]
    if (el) {
      el.style.left = `${trails[i].x}px`
      el.style.top = `${trails[i].y}px`
    }
  }

  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="page">
    <div
      v-for="i in trailCount"
      :key="i"
      :ref="(el: any) => { if (el) trailEls[i - 1] = el }"
      class="glow"
      :class="[`trail-${i}`, { visible: glowVisible }]"
    />

    <svg class="noise" width="0" height="0">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </svg>
    <div class="noise-overlay" />

    <header class="header" :class="{ 'has-close': showClose }">
      <NuxtLink to="/" class="header-link">
        <img src="~/assets/logo.png" alt="Seqman" class="logo-img">
        <h1 class="logo">Seqman</h1>
      </NuxtLink>
      <p class="subtitle">Stepdeq</p>
      <button
        v-if="showClose"
        class="close-btn"
        aria-label="Close"
        @click="close"
      />

    </header>

    <main class="content">
      <NuxtPage />
    </main>

    <footer class="footer">
      <p>&copy; {{ new Date().getFullYear() }} Seqman &middot; <a href="mailto:hello@seqman.com">hello@seqman.com</a> &middot; <a href="https://www.seqman.com">www.seqman.com</a></p>
      <nav class="footer-links">
        <NuxtLink to="/eula">EULA</NuxtLink>
        <span class="sep">&middot;</span>
        <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
      </nav>
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
  overflow-x: hidden;
}

a {
  color: #b391a7;
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: #d4b3c8;
  text-decoration: none;
}

.glow {
  position: fixed;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(179, 145, 167, 0.07) 0%,
    rgba(179, 145, 167, 0.04) 20%,
    rgba(179, 145, 167, 0.015) 40%,
    transparent 60%
  );
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 0;
  opacity: 0;
  transition: opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: drift 12s ease-in-out infinite;
}

.glow.visible {
  opacity: 1;
}

.trail-1 {
  width: 500px;
  height: 500px;
}

.trail-2 {
  width: 400px;
  height: 400px;
  opacity: 0;
  transition: opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.trail-2.visible { opacity: 0.45; }

.trail-3 {
  width: 300px;
  height: 300px;
  opacity: 0;
  transition: opacity 2.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.trail-3.visible { opacity: 0.25; }

.trail-4 {
  width: 200px;
  height: 200px;
  opacity: 0;
  transition: opacity 2.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.trail-4.visible { opacity: 0.1; }

@keyframes drift {
  0%   { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); }
  12%  { transform: translate(-50%, -50%) translate(30px, -12px) scale(1.05); }
  25%  { transform: translate(-50%, -50%) translate(50px, 0px) scale(1.1); }
  37%  { transform: translate(-50%, -50%) translate(30px, 12px) scale(1.05); }
  50%  { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); }
  62%  { transform: translate(-50%, -50%) translate(-30px, -12px) scale(1.05); }
  75%  { transform: translate(-50%, -50%) translate(-50px, 0px) scale(1.1); }
  87%  { transform: translate(-50%, -50%) translate(-30px, 12px) scale(1.05); }
  100% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); }
}

.noise {
  position: absolute;
  width: 0;
  height: 0;
}

.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  filter: url(#noise);
  opacity: 0.06;
  width: 100%;
  height: 100%;
}

.page {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: relative;
  text-align: center;
  padding-bottom: 1.5rem;
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: #1e1e1e;
}

.header.has-close::after {
  right: 52px;
}

.close-btn {
  position: absolute;
  bottom: -20px;
  right: 0;
  z-index: 10;
  background: none;
  border: 1px solid #2a2a2a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: border-color 0.3s;
  padding: 0;
}

.close-btn::before,
.close-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 1.5px;
  background: #555;
  border-radius: 1px;
  transition: background 0.3s;
}

.close-btn::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-btn::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.close-btn:hover {
  border-color: #d4b3c8;
}

.close-btn:hover::before,
.close-btn:hover::after {
  background: #d4b3c8;
}

.header-link {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

.header-link:hover {
  text-decoration: none;
}

.logo-img {
  width: 120px;
  height: auto;
  margin-bottom: 0.75rem;
}

.logo {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
  transition: color 0.3s;
  cursor: default;
}

.logo:hover {
  color: #d4b3c8;
}

.subtitle {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
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
  color: #d4b3c8;
}

.footer-links {
  margin-top: 0.5rem;
}

.footer-links a {
  color: #555;
}

.footer-links a:hover {
  color: #d4b3c8;
}

.footer-links .sep {
  margin: 0 0.4rem;
  color: #333;
}
</style>
