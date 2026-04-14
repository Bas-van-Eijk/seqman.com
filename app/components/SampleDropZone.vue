<script setup lang="ts">
const { samples, addSamples, removeSample, renameSample, assignToSlot, selectedId, selectSample } = useSamples()

const dropZoneRef = ref<HTMLDivElement>()

const { isOverDropZone } = useDropZone(dropZoneRef, {
  dataTypes: ['audio/wav', 'audio/x-wav', 'audio/wave'],
  onDrop(files) {
    if (files) addSamples(Array.from(files))
  },
})

function onDragStartSample(event: DragEvent, sampleId: string) {
  event.dataTransfer!.effectAllowed = 'copy'
  event.dataTransfer!.setData('application/sample-id', sampleId)
}

let currentAudio: HTMLAudioElement | null = null
const playingId = ref<string | null>(null)
const hoveredId = ref<string | null>(null)

const activeSampleId = computed(() => hoveredId.value ?? selectedId.value)

const editingId = ref<string | null>(null)
const editingName = ref('')

function startRename(id: string, name: string) {
  editingId.value = id
  editingName.value = name
}

function commitRename() {
  if (editingId.value && editingName.value.trim()) {
    renameSample(editingId.value, editingName.value)
  }
  editingId.value = null
}

function cancelRename() {
  editingId.value = null
}

function playSample(id: string, file: File) {
  stopPlayback()
  const url = URL.createObjectURL(file)
  currentAudio = new Audio(url)
  playingId.value = id
  currentAudio.addEventListener('ended', () => {
    URL.revokeObjectURL(url)
    currentAudio = null
    playingId.value = null
  })
  currentAudio.play()
}

function stopPlayback() {
  if (currentAudio) {
    currentAudio.pause()
    URL.revokeObjectURL(currentAudio.src)
    currentAudio = null
    playingId.value = null
  }
}

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.defaultPrevented) return
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
  const num = Number(e.key)
  if (num < 1 || num > 8) return
  const sample = samples.value.find((s) => s.id === activeSampleId.value)
  if (!sample) return
  e.preventDefault()
  assignToSlot(num - 1, sample)
})
</script>

<template>
  <div class="samples-panel">
    <h2>Samples</h2>

    <div
      ref="dropZoneRef"
      class="drop-zone"
      :class="{ 'drop-zone--over': isOverDropZone }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p>Drop <strong>.wav</strong> / <strong>.aiff</strong> files here</p>
    </div>

    <div v-if="samples.length > 0" class="sample-list-wrapper">
      <div class="sample-list-header">
        <span class="sample-list-count">{{ samples.length }} sample{{ samples.length !== 1 ? 's' : '' }}</span>
        <span class="sample-list-hint">Press 1–8 to assign</span>
      </div>
      <ul class="sample-list">
        <li
          v-for="sample in samples"
          :key="sample.id"
          class="sample-item"
          :class="{ 'sample-item--selected': selectedId === sample.id }"
          draggable="true"
          @dragstart="onDragStartSample($event, sample.id)"
          @click="selectSample(sample.id)"
          @mouseenter="hoveredId = sample.id"
          @mouseleave="hoveredId = null"
        >
          <button
            v-if="playingId === sample.id"
            class="sample-item__play sample-item__play--active"
            title="Stop"
            @click="stopPlayback()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
          </button>
          <button
            v-else
            class="sample-item__play"
            title="Play sample"
            @click="playSample(sample.id, sample.file)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          </button>
          <input
            v-if="editingId === sample.id"
            v-model="editingName"
            class="sample-item__name-input"
            @keydown.enter="commitRename"
            @keydown.escape="cancelRename"
            @blur="commitRename"
            @vue:mounted="($event: any) => $event.el.focus()"
            @click.stop
          >
          <span
            v-else
            class="sample-item__name"
            @dblclick.stop="startRename(sample.id, sample.name)"
          >{{ sample.name }}</span>
          <button
            class="sample-item__remove"
            title="Remove sample"
            @click="removeSample(sample.id)"
          >
            &times;
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.samples-panel h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--c-text-active);
}

.drop-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: 2px dashed var(--c-playhead);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s ease;
  background: var(--c-surface);
  color: var(--c-text-inactive);
  user-select: none;
}

.drop-zone p {
  margin: 0;
  font-size: 0.9rem;
}

.drop-zone--over {
  border-color: var(--c-border);
  background: var(--c-playhead);
  color: var(--c-playhead-active);
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.12);
}

.sample-list-wrapper {
  margin-top: 1rem;
}

.sample-list-header {
  margin-bottom: 0.5rem;
}

.sample-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sample-list-count {
  font-size: 0.75rem;
  color: var(--c-text-inactive);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sample-list-hint {
  font-size: 0.65rem;
  color: var(--c-text-inactive);
  opacity: 0.6;
}

.sample-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.sample-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.75rem;
  background: var(--c-surface);
  border: 1px solid var(--c-playhead);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.15s ease;
}

.sample-item--selected {
  background: var(--c-surface-raised);
  border-color: var(--c-on);
  box-shadow: 0 0 8px rgba(0, 170, 136, 0.15);
}

.sample-item:hover {
  background: var(--c-surface-raised);
  border-color: var(--c-on);
}

.sample-item:active {
  cursor: grabbing;
}

.sample-item__play {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: var(--c-playhead);
  border: none;
  border-radius: 50%;
  color: var(--c-text-inactive);
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.15s ease;
}

.sample-item__play:hover {
  background: var(--c-on);
  color: var(--c-off);
}

.sample-item__play--active {
  background: var(--c-on);
  color: var(--c-off);
}

.sample-item__play--active:hover {
  background: #f44;
  color: var(--c-text-active);
}

.sample-item__name {
  flex: 1;
  min-width: 0;
  font-size: 0.85rem;
  color: var(--c-text-active);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
}

.sample-item__name-input {
  flex: 1;
  min-width: 0;
  font-size: 0.85rem;
  color: var(--c-text-active);
  background: var(--c-off);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 0.15rem 0.35rem;
  outline: none;
  font-family: inherit;
}

.sample-item__remove {
  background: none;
  border: none;
  color: var(--c-text-inactive);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.25rem;
  line-height: 1;
  transition: color 0.15s;
}

.sample-item__remove:hover {
  color: #f44;
}
</style>
