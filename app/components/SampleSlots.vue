<script setup lang="ts">
import { midiToNoteName } from '~/composables/useSamples'

const { slots, samples, assignToSlot, clearSlot, swapSlots, selectSlot, selectedSlotIndex, kitType } = useSamples()

const overSlot = ref<number | null>(null)

function truncateName(name: string, maxLen = 14): string {
  const base = name.replace(/\.(wav|aiff?)$/i, '')
  if (base.length <= maxLen) return base
  return base.slice(0, maxLen - 1) + '…'
}

function onDragStartSlot(event: DragEvent, index: number) {
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('application/slot-index', String(index))
}

function onDragOver(event: DragEvent, index: number) {
  const types = event.dataTransfer?.types
  if (types?.includes('application/sample-id') || types?.includes('application/slot-index')) {
    event.preventDefault()
    event.dataTransfer!.dropEffect = types.includes('application/slot-index') ? 'move' : 'copy'
    overSlot.value = index
  }
}

function onDragLeave(_event: DragEvent, index: number) {
  if (overSlot.value === index) overSlot.value = null
}

function onDrop(event: DragEvent, index: number) {
  event.preventDefault()
  overSlot.value = null

  const slotIndex = event.dataTransfer?.getData('application/slot-index')
  if (slotIndex !== undefined && slotIndex !== '') {
    const from = Number(slotIndex)
    if (from !== index) swapSlots(from, index)
    return
  }

  const sampleId = event.dataTransfer?.getData('application/sample-id')
  if (!sampleId) return
  const sample = samples.value.find((s) => s.id === sampleId)
  if (sample) assignToSlot(index, sample)
}

</script>

<template>
  <div class="slots-wrapper">
    <h2>Pads</h2>
    <div class="slots-grid">
      <div
        v-for="(slot, index) in slots"
        :key="index"
        class="slot"
        :class="{
          'slot--filled': slot.sample,
          'slot--over': overSlot === index,
          'slot--selected': selectedSlotIndex === index,
        }"
        :draggable="!!slot.sample"
        @click="selectSlot(index)"
        @dragstart="slot.sample && onDragStartSlot($event, index)"
        @dragover="onDragOver($event, index)"
        @dragleave="onDragLeave($event, index)"
        @drop="onDrop($event, index)"
      >
        <span class="slot__number">{{ index + 1 }}</span>

        <!-- Drum mode -->
        <template v-if="kitType === 'drum'">
          <template v-if="slot.sample">
            <button
              class="slot__clear"
              title="Clear slot"
              @click.stop="clearSlot(index)"
            >
              &times;
            </button>
            <span class="slot__name" :title="slot.sample.name">{{ truncateName(slot.sample.name) }}</span>
            <span class="slot__choke-badge">CH {{ slot.chokeGroup }}</span>
          </template>
          <span v-else class="slot__empty">Empty</span>
        </template>

        <!-- Keys mode -->
        <template v-else>
          <span class="slot__note">{{ midiToNoteName(slot.rootNote) }}</span>
          <template v-if="slot.sample">
            <button
              class="slot__clear"
              title="Clear slot"
              @click.stop="clearSlot(index)"
            >
              &times;
            </button>
            <span class="slot__name slot__name--small" :title="slot.sample.name">{{ truncateName(slot.sample.name, 10) }}</span>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slots-wrapper h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--c-text-active);
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.slot {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background: var(--c-surface);
  border: 2px solid var(--c-playhead);
  border-radius: 12px;
  transition: all 0.15s ease;
  user-select: none;
  padding: 0.5rem;
  overflow: hidden;
  cursor: pointer;
}

.slot[draggable='true'] {
  cursor: grab;
}

.slot[draggable='true']:active {
  cursor: grabbing;
}

.slot--over {
  border-color: var(--c-border);
  background: var(--c-playhead);
  box-shadow: 0 0 16px rgba(0, 255, 204, 0.15);
  transform: scale(1.03);
}

.slot--filled {
  border-color: var(--c-on);
  background: linear-gradient(135deg, var(--c-surface) 0%, var(--c-playhead) 100%);
}

.slot--selected {
  border-color: var(--c-border);
  box-shadow: 0 0 16px rgba(0, 255, 204, 0.25);
}

.slot__number {
  position: absolute;
  top: 0.4rem;
  left: 0.55rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--c-text-inactive);
}

.slot__name {
  font-size: 0.7rem;
  color: var(--c-text-active);
  text-align: center;
  padding: 0 0.25rem;
  max-width: 100%;
  word-break: break-all;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slot__name--small {
  font-size: 0.6rem;
  color: var(--c-text-inactive);
  -webkit-line-clamp: 1;
}

.slot__note {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-border);
}

.slot__empty {
  font-size: 0.75rem;
  color: var(--c-text-inactive);
}

.slot__clear {
  position: absolute;
  top: 0.25rem;
  right: 0.4rem;
  background: none;
  border: none;
  color: var(--c-text-inactive);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.15s;
  z-index: 1;
}

.slot__clear:hover {
  color: #f44;
}

.slot__choke-badge {
  font-size: 0.55rem;
  color: var(--c-text-inactive);
  background: var(--c-off);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  letter-spacing: 0.03em;
}
</style>
