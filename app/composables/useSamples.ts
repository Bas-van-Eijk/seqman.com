export interface Sample {
  id: string
  name: string
  file: File
}

export interface SlotData {
  sample: Sample | null
  chokeGroup: number
  rootNote: number
}

export interface ZoneData {
  sample: Sample
  rootNote: number
}

export type KitType = 'drum' | 'keys'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 2
  return `${NOTE_NAMES[midi % 12]}${octave}`
}

export const NOTE_OPTIONS: { value: number; label: string }[] = Array.from({ length: 128 }, (_, i) => ({
  value: i,
  label: midiToNoteName(i),
}))

const samples = ref<Sample[]>([])
const slots = ref<SlotData[]>(
  Array.from({ length: 8 }, () => ({ sample: null, chokeGroup: 0, rootNote: 60 })),
)
const selectedId = ref<string | null>(null)
const selectedSlotIndex = ref<number | null>(null)
const kitType = ref<KitType>('drum')
const zones = ref<ZoneData[]>([])

export function useSamples() {
  function selectSlot(index: number | null) {
    selectedSlotIndex.value = selectedSlotIndex.value === index ? null : index
  }

  const selectedSlot = computed(() =>
    selectedSlotIndex.value !== null ? slots.value[selectedSlotIndex.value] ?? null : null,
  )
  function addSamples(files: File[]) {
    const wavFiles = files.filter((f) => /\.(wav|aiff?)$/i.test(f.name))
    const newSamples = wavFiles
      .filter((f) => !samples.value.some((s) => s.name === f.name))
      .map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        file: f,
      }))
    samples.value.push(...newSamples)
  }

  function assignToSlot(slotIndex: number, sample: Sample) {
    slots.value[slotIndex] = { ...slots.value[slotIndex], sample }
  }

  function clearSlot(slotIndex: number) {
    slots.value[slotIndex] = { ...slots.value[slotIndex], sample: null }
  }

  function setChokeGroup(slotIndex: number, group: number) {
    slots.value[slotIndex] = { ...slots.value[slotIndex], chokeGroup: group }
  }

  function setSlotRootNote(slotIndex: number, note: number) {
    slots.value[slotIndex] = { ...slots.value[slotIndex], rootNote: note }
  }

  function swapSlots(fromIndex: number, toIndex: number) {
    const temp = slots.value[fromIndex]
    slots.value[fromIndex] = slots.value[toIndex]
    slots.value[toIndex] = temp
  }

  function removeSample(id: string) {
    samples.value = samples.value.filter((s) => s.id !== id)
    slots.value = slots.value.map((s) =>
      s.sample?.id === id ? { ...s, sample: null } : s,
    )
    zones.value = zones.value.filter((z) => z.sample.id !== id)
    if (selectedId.value === id) selectedId.value = null
  }

  function selectSample(id: string | null) {
    selectedId.value = selectedId.value === id ? null : id
  }

  const selectedSample = computed(() =>
    samples.value.find((s) => s.id === selectedId.value) ?? null,
  )

  function replaceSampleFile(id: string, newFile: File) {
    const idx = samples.value.findIndex((s) => s.id === id)
    if (idx === -1) return
    samples.value[idx] = { ...samples.value[idx], file: newFile, name: newFile.name }
    for (let i = 0; i < slots.value.length; i++) {
      if (slots.value[i].sample?.id === id) {
        slots.value[i] = { ...slots.value[i], sample: samples.value[idx] }
      }
    }
  }

  function addSampleFromBuffer(name: string, audioBuffer: AudioBuffer, startSec: number, endSec: number) {
    const sampleRate = audioBuffer.sampleRate
    const channels = audioBuffer.numberOfChannels
    const startFrame = Math.round(startSec * sampleRate)
    const endFrame = Math.round(endSec * sampleRate)
    const frameCount = endFrame - startFrame

    const wavBuffer = encodeWav(audioBuffer, startFrame, frameCount, channels, sampleRate)
    const file = new File([wavBuffer], name, { type: 'audio/wav' })
    const sample: Sample = { id: crypto.randomUUID(), name, file }
    samples.value.push(sample)
    return sample
  }

  function addZone(sample: Sample, rootNote: number) {
    if (zones.value.some((z) => z.sample.id === sample.id)) return
    zones.value.push({ sample, rootNote })
  }

  function removeZone(sampleId: string) {
    zones.value = zones.value.filter((z) => z.sample.id !== sampleId)
  }

  function setZoneRootNote(sampleId: string, rootNote: number) {
    const idx = zones.value.findIndex((z) => z.sample.id === sampleId)
    if (idx === -1) return
    zones.value[idx] = { ...zones.value[idx], rootNote }
  }

  function renameSample(id: string, newName: string) {
    const trimmed = newName.trim()
    if (!trimmed) return
    const idx = samples.value.findIndex((s) => s.id === id)
    if (idx === -1) return
    samples.value[idx] = { ...samples.value[idx], name: trimmed }
    for (let i = 0; i < slots.value.length; i++) {
      if (slots.value[i].sample?.id === id) {
        slots.value[i] = { ...slots.value[i], sample: samples.value[idx] }
      }
    }
    for (let i = 0; i < zones.value.length; i++) {
      if (zones.value[i].sample.id === id) {
        zones.value[i] = { ...zones.value[i], sample: samples.value[idx] }
      }
    }
  }

  function setKitType(type: KitType) {
    kitType.value = type
  }

  return {
    samples: readonly(samples),
    slots: readonly(slots),
    selectedId: readonly(selectedId),
    selectedSlotIndex: readonly(selectedSlotIndex),
    kitType: readonly(kitType),
    zones: readonly(zones),
    selectedSample,
    selectedSlot,
    addSamples,
    addSampleFromBuffer,
    replaceSampleFile,
    assignToSlot,
    clearSlot,
    setChokeGroup,
    setSlotRootNote,
    swapSlots,
    selectSample,
    selectSlot,
    removeSample,
    renameSample,
    addZone,
    removeZone,
    setZoneRootNote,
    setKitType,
  }
}

function encodeWav(buffer: AudioBuffer, startFrame: number, frameCount: number, channels: number, sampleRate: number): ArrayBuffer {
  const bytesPerSample = 2
  const dataSize = frameCount * channels * bytesPerSample
  const headerSize = 44
  const arrayBuffer = new ArrayBuffer(headerSize + dataSize)
  const view = new DataView(arrayBuffer)

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * channels * bytesPerSample, true)
  view.setUint16(32, channels * bytesPerSample, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)

  let offset = 44
  for (let i = 0; i < frameCount; i++) {
    for (let ch = 0; ch < channels; ch++) {
      const sample = buffer.getChannelData(ch)[startFrame + i]
      const clamped = Math.max(-1, Math.min(1, sample))
      view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF, true)
      offset += 2
    }
  }

  return arrayBuffer
}
