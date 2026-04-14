<script setup lang="ts">
import { NOTE_OPTIONS, midiToNoteName } from '~/composables/useSamples'

const { selectedSlotIndex, selectedSlot, setChokeGroup, setSlotRootNote, clearSlot, kitType } = useSamples()

let currentAudio: HTMLAudioElement | null = null
const isPlaying = ref(false)

function play() {
  const file = selectedSlot.value?.sample?.file
  if (!file) return

  stop()
  const url = URL.createObjectURL(file)
  currentAudio = new Audio(url)
  isPlaying.value = true
  currentAudio.addEventListener('ended', () => {
    URL.revokeObjectURL(url)
    currentAudio = null
    isPlaying.value = false
  })
  currentAudio.play()
}

function stop() {
  if (currentAudio) {
    currentAudio.pause()
    URL.revokeObjectURL(currentAudio.src)
    currentAudio = null
  }
  isPlaying.value = false
}

watch(selectedSlotIndex, () => {
  stop()
})
</script>

<template>
  <div class="inspector">
    <h2>Pad Inspector</h2>

    <template v-if="selectedSlotIndex !== null && selectedSlot">
      <div class="inspector__header">
        <span class="inspector__pad-num">Pad {{ selectedSlotIndex + 1 }}</span>
        <span v-if="kitType === 'keys'" class="inspector__note-badge">
          {{ midiToNoteName(selectedSlot.rootNote) }}
        </span>
      </div>

      <!-- Keys mode: root note picker (always visible) -->
      <div v-if="kitType === 'keys'" class="inspector__field">
        <label>Root Note</label>
        <select
          class="inspector__select"
          :value="selectedSlot.rootNote"
          @change="setSlotRootNote(selectedSlotIndex!, Number(($event.target as HTMLSelectElement).value))"
        >
          <option
            v-for="opt in NOTE_OPTIONS"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }} ({{ opt.value }})
          </option>
        </select>
      </div>

      <template v-if="selectedSlot.sample">
        <div class="inspector__field">
          <label>Sample</label>
          <span class="inspector__value inspector__value--name" :title="selectedSlot.sample.name">
            {{ selectedSlot.sample.name }}
          </span>
        </div>

        <!-- Drum mode: choke group -->
        <div v-if="kitType === 'drum'" class="inspector__field">
          <label>Choke Group</label>
          <select
            class="inspector__select"
            :value="selectedSlot.chokeGroup"
            @change="setChokeGroup(selectedSlotIndex!, Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="n in 5" :key="n - 1" :value="n - 1">{{ n - 1 }}</option>
          </select>
        </div>

        <div class="inspector__actions">
          <button
            class="inspector__btn inspector__btn--play"
            :class="{ 'inspector__btn--stop': isPlaying }"
            @click="isPlaying ? stop() : play()"
          >
            <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            {{ isPlaying ? 'Stop' : 'Play' }}
          </button>
          <button
            class="inspector__btn inspector__btn--clear"
            @click="clearSlot(selectedSlotIndex!)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            Clear
          </button>
        </div>
      </template>

      <div v-else class="inspector__empty-slot">
        <p>No sample assigned</p>
        <span>{{ kitType === 'drum' ? 'Drag a sample onto this pad' : 'Drag a sample or set the root note' }}</span>
      </div>
    </template>

    <div v-else class="inspector__empty">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
      <p>Select a pad to inspect</p>
    </div>
  </div>
</template>

<style scoped>
.inspector {
  background: var(--c-surface);
  border: 1px solid var(--c-playhead);
  border-radius: 12px;
  padding: 1rem;
}

.inspector h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--c-text-active);
}

.inspector__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.inspector__pad-num {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--c-on);
  background: var(--c-off);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.inspector__note-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--c-border);
  background: var(--c-off);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.inspector__field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
}

.inspector__field label {
  font-size: 0.65rem;
  color: var(--c-text-inactive);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.inspector__value {
  font-size: 0.85rem;
  color: var(--c-text-active);
}

.inspector__value--name {
  font-size: 0.8rem;
  word-break: break-all;
  line-height: 1.4;
  background: var(--c-off);
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--c-playhead);
}

.inspector__select {
  appearance: none;
  background: var(--c-off);
  border: 1px solid var(--c-playhead);
  border-radius: 6px;
  color: var(--c-text-active);
  font-size: 0.8rem;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
  width: fit-content;
}

.inspector__select:hover,
.inspector__select:focus {
  border-color: var(--c-border);
}

.inspector__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.inspector__btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  flex: 1;
  justify-content: center;
}

.inspector__btn--play {
  background: var(--c-on);
  color: var(--c-off);
}

.inspector__btn--play:hover {
  background: var(--c-playhead-active);
  box-shadow: 0 0 12px rgba(0, 170, 136, 0.3);
}

.inspector__btn--stop {
  background: var(--c-on);
  color: var(--c-off);
}

.inspector__btn--stop:hover {
  background: #f44;
  color: var(--c-text-active);
}

.inspector__btn--clear {
  background: var(--c-playhead);
  color: var(--c-text-active);
}

.inspector__btn--clear:hover {
  background: #f44;
  color: var(--c-text-active);
}

.inspector__empty,
.inspector__empty-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 100px;
  color: var(--c-text-inactive);
  opacity: 0.5;
  text-align: center;
}

.inspector__empty p,
.inspector__empty-slot p {
  margin: 0;
  font-size: 0.85rem;
}

.inspector__empty-slot span {
  font-size: 0.7rem;
}
</style>
