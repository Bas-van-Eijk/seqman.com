<script setup lang="ts">
const revealEls = ref<HTMLElement[]>([])

function setRevealRef(el: any) {
  if (el && !revealEls.value.includes(el)) revealEls.value.push(el)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('show')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12 },
  )
  for (const el of revealEls.value) observer.observe(el)
  onUnmounted(() => observer.disconnect())
})

const features = [
  {
    icon: '⬛',
    svg: 'grid',
    title: 'Hardware-First',
    text: 'No screen needed. Compose, perform and mix beats entirely by touch on the Stream Deck.',
  },
  {
    icon: '🔊',
    svg: 'audio',
    title: 'Built-In Audio',
    text: 'Zero-latency sample engine plays sounds directly. Plug in headphones and go.',
  },
  {
    icon: '🎹',
    svg: 'midi',
    title: 'DAW Integration',
    text: 'Send MIDI to Ableton, Logic or any DAW. Sync to external MIDI clock.',
  },
  {
    icon: '✨',
    svg: 'fx',
    title: '10 Performance FX',
    text: 'Delay, reverb, filter, bitcrush, tape stop and more — hold to activate, release to kill.',
  },
  {
    icon: '🥁',
    svg: 'kit',
    title: 'Custom Drum Kits',
    text: 'Ships with classic machines. Load your own WAV samples with a simple JSON config.',
  },
  {
    icon: '🎵',
    svg: 'song',
    title: 'Song Mode',
    text: 'Chain 48 patterns across 8 drum machines into full 128-bar arrangements.',
  },
  {
    icon: '⏺',
    svg: 'record',
    title: 'Record & Export',
    text: 'Bounce your session to WAV or MP3 directly from the Stream Deck.',
  },
  {
    icon: '🎨',
    svg: 'color',
    title: '16 Color Schemes',
    text: '8 presets plus 8 fully customizable themes. Make it yours.',
  },
]

const faqItems = [
  {
    q: 'Does StepDeq require a DAW?',
    a: 'No. StepDeq has a built-in audio engine that plays samples directly. You can also send MIDI to any DAW if you prefer.',
  },
  {
    q: 'Which Stream Deck models are supported?',
    a: 'StepDeq is designed for the standard Elgato Stream Deck with 15 buttons (5×3 grid).',
  },
  {
    q: 'Can I use my own samples?',
    a: 'Yes. Drop WAV files into a kit folder with a simple kit.json config and load them from the PGM browser.',
  },
  {
    q: 'Does the sequencer keep playing when the display sleeps?',
    a: 'Yes. Audio and MIDI playback continue normally — only the Stream Deck display is affected by screensaver settings.',
  },
]
</script>

<template>
  <div class="landing">
    <!-- Hero -->
    <section class="hero">
      <svg
        class="tape-icon"
        width="72"
        height="72"
        viewBox="0 0 144 144"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g class="tape-reels">
          <g transform="translate(42, 72)">
            <rect x="-12" y="-12" width="24" height="24" fill="none" stroke="#FFFFFF" stroke-width="2" rx="2" />
            <rect x="-8" y="-2" width="16" height="4" fill="#FFFFFF" />
            <rect x="-2" y="-8" width="4" height="16" fill="#FFFFFF" />
          </g>
          <g transform="translate(102, 72)">
            <rect x="-12" y="-12" width="24" height="24" fill="none" stroke="#FFFFFF" stroke-width="2" rx="2" />
            <rect x="-8" y="-2" width="16" height="4" fill="#FFFFFF" />
            <rect x="-2" y="-8" width="4" height="16" fill="#FFFFFF" />
          </g>
        </g>
        <line x1="54" y1="60" x2="90" y2="60" stroke="#FFFFFF" stroke-width="2" />
        <line x1="54" y1="84" x2="90" y2="84" stroke="#FFFFFF" stroke-width="2" />
      </svg>

      <h2 class="hero-title">A drum machine on your Stream&nbsp;Deck</h2>
      <p class="hero-sub">
        StepDeq is a step sequencer and drum machine that runs entirely on the Elgato Stream Deck.
        15 buttons. 8 tracks. No DAW required.
      </p>
      <a href="#features" class="hero-cta">Explore features</a>
    </section>

    <!-- Stats strip -->
    <section :ref="setRevealRef" class="stats">
      <div class="stat">
        <span class="stat-num">48</span>
        <span class="stat-label">patterns</span>
      </div>
      <div class="stat-sep" />
      <div class="stat">
        <span class="stat-num">8</span>
        <span class="stat-label">tracks</span>
      </div>
      <div class="stat-sep" />
      <div class="stat">
        <span class="stat-num">64</span>
        <span class="stat-label">steps</span>
      </div>
      <div class="stat-sep" />
      <div class="stat">
        <span class="stat-num">10</span>
        <span class="stat-label">FX slots</span>
      </div>
      <div class="stat-sep" />
      <div class="stat">
        <span class="stat-num">16</span>
        <span class="stat-label">color schemes</span>
      </div>
    </section>

    <!-- Video -->
    <section :ref="setRevealRef" class="video-section">
      <div class="video-wrap">
        <iframe
          src="https://www.youtube.com/embed/7Goe0BEkExI"
          title="StepDeq demo"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
    </section>

    <!-- Features -->
    <section id="features" :ref="setRevealRef" class="features">
      <h3 class="section-title">Features</h3>
      <div class="feature-grid">
        <div v-for="f in features" :key="f.title" class="feature-card">
          <div class="feature-icon">{{ f.icon }}</div>
          <h4>{{ f.title }}</h4>
          <p>{{ f.text }}</p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section :ref="setRevealRef" class="how-it-works">
      <h3 class="section-title">How It Works</h3>
      <p class="how-sub">
        StepDeq maps a full drum machine to the Stream Deck's 5×3 button grid.
        Tap steps to build beats, hold buttons for FX, and navigate views with modifier combos.
      </p>
      <div class="grid-visual">
        <div class="grid-row">
          <div class="grid-btn step">Step 1</div>
          <div class="grid-btn step">Step 2</div>
          <div class="grid-btn step">Step 3</div>
          <div class="grid-btn step">Step 4</div>
          <div class="grid-btn ctrl">Track</div>
        </div>
        <div class="grid-row">
          <div class="grid-btn step">Step 5</div>
          <div class="grid-btn step">Step 6</div>
          <div class="grid-btn step">Step 7</div>
          <div class="grid-btn step">Step 8</div>
          <div class="grid-btn ctrl">Pattern</div>
        </div>
        <div class="grid-row">
          <div class="grid-btn mod">Shift</div>
          <div class="grid-btn mod">Sound</div>
          <div class="grid-btn mod">BPM</div>
          <div class="grid-btn mod">Mod</div>
          <div class="grid-btn play">Play</div>
        </div>
      </div>
      <p class="how-hint">
        Each button has multiple roles via Shift and Mod modifiers — giving you access to
        mixer, velocity editor, FX chains, song mode, settings and more.
      </p>
    </section>

    <!-- FAQ teaser -->
    <section :ref="setRevealRef" class="faq-teaser">
      <h3 class="section-title">Frequently Asked</h3>
      <div class="faq-list">
        <details v-for="item in faqItems" :key="item.q" class="faq-item">
          <summary>{{ item.q }}</summary>
          <p>{{ item.a }}</p>
        </details>
      </div>
      <NuxtLink to="/faq" class="faq-more">View all FAQs</NuxtLink>
    </section>

    <!-- Marketplace CTA -->
    <section :ref="setRevealRef" class="marketplace-cta">
      <p class="cta-label">Available soon on the</p>
      <p class="cta-brand">Elgato Marketplace</p>
      <p class="cta-hint">StepDeq is coming to the Stream Deck Marketplace. Stay tuned.</p>
    </section>
  </div>
</template>

<style scoped>
.landing {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* ---- Reveal animation ---- */
.stats,
.video-section,
.features,
.how-it-works,
.faq-teaser,
.marketplace-cta {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.show {
  opacity: 1;
  transform: translateY(0);
}

/* ---- Hero ---- */
.hero {
  text-align: center;
  padding: 2rem 0 0;
}

.tape-icon {
  margin-bottom: 1.25rem;
  opacity: 0.5;
}

.tape-reels {
  transform-origin: 72px 72px;
  animation: spin-tape 1.09s linear infinite;
}

@keyframes spin-tape {
  to { transform: rotate(360deg); }
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 0.75rem;
}

.hero-sub {
  font-size: 1rem;
  color: #888;
  max-width: 480px;
  margin: 0 auto 1.5rem;
  line-height: 1.7;
}

.hero-cta {
  display: inline-block;
  font-size: 0.85rem;
  color: #d4b3c8;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  transition: border-color 0.3s, color 0.3s;
}

.hero-cta:hover {
  border-color: #d4b3c8;
  color: #fff;
  text-decoration: none;
}

/* ---- Stats strip ---- */
.stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1.5rem 0;
  border-top: 1px solid #1e1e1e;
  border-bottom: 1px solid #1e1e1e;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.stat-num {
  font-size: 1.75rem;
  font-weight: 700;
  color: #d4b3c8;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-sep {
  width: 1px;
  height: 32px;
  background: #1e1e1e;
}

/* ---- Video ---- */
.video-section {
  text-align: center;
}

.video-wrap {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #1e1e1e;
  background: #111;
}

.video-wrap iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* ---- Section title ---- */
.section-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* ---- Features ---- */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (max-width: 540px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 10px;
  padding: 1.25rem;
  transition: border-color 0.3s;
}

.feature-card:hover {
  border-color: #b391a7;
}

.feature-icon {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  filter: grayscale(1) brightness(0.85);
}

.feature-card h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ddd;
  margin-bottom: 0.35rem;
}

.feature-card p {
  font-size: 0.85rem;
  color: #777;
  line-height: 1.6;
}

/* ---- How it works ---- */
.how-it-works {
  text-align: center;
}

.how-sub {
  font-size: 0.9rem;
  color: #888;
  max-width: 520px;
  margin: 0 auto 1.75rem;
  line-height: 1.7;
}

.grid-visual {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 1.25rem;
}

.grid-row {
  display: flex;
  gap: 4px;
}

.grid-btn {
  width: 72px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1px solid #2a2a2a;
}

.grid-btn.step {
  background: #1a1a1a;
  color: #b391a7;
}

.grid-btn.ctrl {
  background: #141414;
  color: #888;
}

.grid-btn.mod {
  background: #141414;
  color: #666;
}

.grid-btn.play {
  background: #1c1520;
  color: #d4b3c8;
  border-color: #b391a7;
}

.how-hint {
  font-size: 0.8rem;
  color: #666;
  max-width: 420px;
  margin: 0 auto;
  line-height: 1.6;
}

@media (max-width: 420px) {
  .grid-btn {
    width: 56px;
    height: 34px;
    font-size: 0.55rem;
  }
}

/* ---- FAQ teaser ---- */
.faq-teaser {
  text-align: center;
}

.faq-list {
  text-align: left;
  max-width: 560px;
  margin: 0 auto 1.25rem;
}

.faq-item {
  border-bottom: 1px solid #1e1e1e;
  padding: 0.85rem 0;
}

.faq-item summary {
  font-size: 0.9rem;
  color: #ccc;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.faq-item summary::before {
  content: '+';
  font-size: 1rem;
  color: #b391a7;
  flex-shrink: 0;
  width: 1rem;
  text-align: center;
  transition: transform 0.2s;
}

.faq-item[open] summary::before {
  content: '−';
}

.faq-item p {
  font-size: 0.85rem;
  color: #777;
  line-height: 1.65;
  margin-top: 0.5rem;
  padding-left: 1.5rem;
}

.faq-more {
  font-size: 0.85rem;
}

/* ---- Marketplace CTA ---- */
.marketplace-cta {
  text-align: center;
  padding: 2.5rem 0 1rem;
  border-top: 1px solid #1e1e1e;
}

.cta-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.cta-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.cta-hint {
  font-size: 0.8rem;
  color: #555;
}
</style>
