<script setup lang="ts">
const showDialog = ref(false)
const isDesktop = ref(false)
const isMac = computed(() =>
  typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac'),
)
const shortcut = computed(() => isMac.value ? '⌘+D' : 'Ctrl+D')

onMounted(() => {
  isDesktop.value = !/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

function bookmark() {
  showDialog.value = true
}

function onKeydown(e: KeyboardEvent) {
  if (!showDialog.value) return
  const modKey = isMac.value ? e.metaKey : e.ctrlKey
  if (modKey && e.key.toLowerCase() === 'd') {
    showDialog.value = false
  }
}

const tapeReels = ref<SVGGElement | null>(null)
let tapeRaf = 0
let tapeAngle = 0
let lastTime = 0
const degreesPerMs = 360 / 1090

function spinTape(now: number) {
  if (lastTime) {
    tapeAngle = (tapeAngle + degreesPerMs * (now - lastTime)) % 360
    tapeReels.value?.setAttribute('transform', `rotate(${tapeAngle}, 72, 72)`)
  }
  lastTime = now
  tapeRaf = requestAnimationFrame(spinTape)
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  tapeRaf = requestAnimationFrame(spinTape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  cancelAnimationFrame(tapeRaf)
})
</script>

<template>
  <div class="home">
    <div class="coming-soon">
      <svg class="tape-icon" width="72" height="72" viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg">
        <g ref="tapeReels" class="tape-reels">
          <g transform="translate(42, 72)">
            <rect x="-12" y="-12" width="24" height="24" fill="none" stroke="#FFFFFF" stroke-width="2" rx="2"/>
            <rect x="-8" y="-2" width="16" height="4" fill="#FFFFFF"/>
            <rect x="-2" y="-8" width="4" height="16" fill="#FFFFFF"/>
          </g>
          <g transform="translate(102, 72)">
            <rect x="-12" y="-12" width="24" height="24" fill="none" stroke="#FFFFFF" stroke-width="2" rx="2"/>
            <rect x="-8" y="-2" width="16" height="4" fill="#FFFFFF"/>
            <rect x="-2" y="-8" width="4" height="16" fill="#FFFFFF"/>
          </g>
        </g>
        <line x1="54" y1="60" x2="90" y2="60" stroke="#FFFFFF" stroke-width="2"/>
        <line x1="54" y1="84" x2="90" y2="84" stroke="#FFFFFF" stroke-width="2"/>
      </svg>
      <h2>Coming Soon</h2>
      <p>We're working on something. Stay tuned.</p>
      <div class="actions">
        <a v-if="isDesktop" href="#" class="action" @click.prevent="bookmark">Bookmark this site</a>
        <a href="mailto:hello@seqman.com?subject=Keep%20me%20posted" class="action">Keep me posted</a>
      </div>
    </div>

    <Transition name="dialog">
      <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog">
          <p>Press <kbd>{{ shortcut }}</kbd> to bookmark this page.</p>
          <p class="dialog-hint">Go ahead — this dialog closes when you do.</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
}

.coming-soon {
  text-align: center;
}

.tape-icon {
  margin-bottom: 1.25rem;
  opacity: 0.5;
}

.tape-reels {
  transform-origin: 72px 72px;
}

.coming-soon h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
  cursor: default;
}

.coming-soon:hover h2 {
  color: #d4b3c8;
}

.coming-soon p {
  font-size: 1rem;
  color: #555;
}

.actions {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.dialog {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  text-align: left;
  max-width: 320px;
}

.dialog p {
  font-size: 0.95rem;
  color: #ccc;
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.dialog p:last-child {
  margin-bottom: 0;
}

.dialog-hint {
  font-size: 0.8rem;
  color: #777;
  margin-top: 0.5rem;
  text-align: left;
}

.dialog kbd {
  display: inline-block;
  background: #222;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  padding: 0.35em 0.75em;
  font-family: inherit;
  font-size: 0.9em;
  color: #d4b3c8;
  margin: 0 0.2em;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-enter-active .dialog,
.dialog-leave-active .dialog {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog {
  transform: scale(0.95);
  opacity: 0;
}

.dialog-leave-to .dialog {
  transform: scale(0.95);
  opacity: 0;
}
</style>
