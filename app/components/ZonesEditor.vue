<script setup lang="ts">
import { NOTE_OPTIONS, midiToNoteName } from '~/composables/useSamples'

const { zones, samples, addZone, removeZone, setZoneRootNote } = useSamples()

const dropOver = ref(false)

function onDragOver(event: DragEvent) {
  if (event.dataTransfer?.types.includes('application/sample-id')) {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'copy'
    dropOver.value = true
  }
}

function onDragLeave() {
  dropOver.value = false
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  dropOver.value = false
  const sampleId = event.dataTransfer?.getData('application/sample-id')
  if (!sampleId) return
  const sample = samples.value.find((s) => s.id === sampleId)
  if (sample) addZone(sample, 60)
}

function addFromSelect(event: Event) {
  const select = event.target as HTMLSelectElement
  const sampleId = select.value
  if (!sampleId) return
  const sample = samples.value.find((s) => s.id === sampleId)
  if (sample) addZone(sample, 60)
  select.value = ''
}

const availableSamples = computed(() =>
  samples.value.filter((s) => !zones.value.some((z) => z.sample.id === s.id)),
)
</script>

<template>
  <div class="zones-editor">
    <h2>Zones</h2>

    <div v-if="zones.length > 0" class="zones-editor__list">
      <div
        v-for="zone in zones"
        :key="zone.sample.id"
        class="zones-editor__row"
      >
        <span class="zones-editor__name" :title="zone.sample.name">{{ zone.sample.name }}</span>
        <select
          class="zones-editor__note-select"
          :value="zone.rootNote"
          @change="setZoneRootNote(zone.sample.id, Number(($event.target as HTMLSelectElement).value))"
        >
          <option
            v-for="opt in NOTE_OPTIONS"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }} ({{ opt.value }})
          </option>
        </select>
        <button
          class="zones-editor__remove"
          title="Remove zone"
          @click="removeZone(zone.sample.id)"
        >
          &times;
        </button>
      </div>
    </div>

    <div
      class="zones-editor__add"
      :class="{ 'zones-editor__add--over': dropOver }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <span class="zones-editor__add-label">Drag sample here or</span>
      <select
        class="zones-editor__add-select"
        :disabled="availableSamples.length === 0"
        @change="addFromSelect"
      >
        <option value="">
          {{ availableSamples.length === 0 ? 'No samples available' : 'Pick a sample…' }}
        </option>
        <option
          v-for="s in availableSamples"
          :key="s.id"
          :value="s.id"
        >
          {{ s.name }}
        </option>
      </select>
    </div>

    <p v-if="zones.length === 0" class="zones-editor__hint">
      Add zone samples to define the keyboard mapping
    </p>
  </div>
</template>

<style scoped>
.zones-editor {
  background: var(--c-surface);
  border: 1px solid var(--c-playhead);
  border-radius: 12px;
  padding: 1rem;
}

.zones-editor h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--c-text-active);
}

.zones-editor__list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
}

.zones-editor__row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--c-off);
  border: 1px solid var(--c-playhead);
  border-radius: 6px;
  padding: 0.35rem 0.5rem;
}

.zones-editor__name {
  flex: 1;
  min-width: 0;
  font-size: 0.75rem;
  color: var(--c-text-active);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zones-editor__note-select {
  appearance: none;
  background: var(--c-surface);
  border: 1px solid var(--c-playhead);
  border-radius: 4px;
  color: var(--c-text-active);
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
  flex-shrink: 0;
}

.zones-editor__note-select:hover,
.zones-editor__note-select:focus {
  border-color: var(--c-border);
}

.zones-editor__remove {
  background: none;
  border: none;
  color: var(--c-text-inactive);
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.15s;
  flex-shrink: 0;
}

.zones-editor__remove:hover {
  color: #f44;
}

.zones-editor__add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 2px dashed var(--c-playhead);
  border-radius: 8px;
  transition: all 0.15s;
}

.zones-editor__add--over {
  border-color: var(--c-border);
  background: rgba(0, 255, 204, 0.05);
}

.zones-editor__add-label {
  font-size: 0.7rem;
  color: var(--c-text-inactive);
  flex-shrink: 0;
}

.zones-editor__add-select {
  appearance: none;
  background: var(--c-off);
  border: 1px solid var(--c-playhead);
  border-radius: 4px;
  color: var(--c-text-active);
  font-size: 0.7rem;
  padding: 0.25rem 0.4rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
  flex: 1;
  min-width: 0;
}

.zones-editor__add-select:hover,
.zones-editor__add-select:focus {
  border-color: var(--c-border);
}

.zones-editor__add-select:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zones-editor__hint {
  margin: 0.5rem 0 0;
  font-size: 0.7rem;
  color: var(--c-text-inactive);
  opacity: 0.6;
  text-align: center;
}
</style>
