<script setup lang="ts">
const { selectedSample, addSampleFromBuffer, replaceSampleFile } = useSamples()

const canvasRef = ref<HTMLCanvasElement>()
const wrapperRef = ref<HTMLDivElement>()
const scrollbarTrackRef = ref<HTMLDivElement>()

const audioBuffer = ref<AudioBuffer | null>(null)
const duration = ref(0)
const markerIn = ref(0)
const markerOut = ref(1)
const dragging = ref<'in' | 'out' | 'region' | null>(null)
const dragStartX = ref(0)
const dragStartIn = ref(0)
const dragStartOut = ref(0)
const chopCount = ref(1)

const viewStart = ref(0)
const viewEnd = ref(1)
const zoom = ref(1)
const MAX_ZOOM = 500

// Playhead
const playheadTime = ref(-1)
let playheadRaf = 0
let previewAudio: HTMLAudioElement | null = null
const isPreviewing = ref(false)

function stopPreview() {
  if (!import.meta.client) return
  if (previewAudio) {
    previewAudio.pause()
    URL.revokeObjectURL(previewAudio.src)
    previewAudio = null
  }
  isPreviewing.value = false
  playheadTime.value = -1
  cancelAnimationFrame(playheadRaf)
}

let audioCtx: AudioContext | null = null
function getAudioContext() {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

watch(selectedSample, async (sample) => {
  if (!import.meta.client) return
  stopPreview()
  if (!sample) {
    audioBuffer.value = null
    duration.value = 0
    return
  }
  const ctx = getAudioContext()
  const arrayBuf = await sample.file.arrayBuffer()
  const decoded = await ctx.decodeAudioData(arrayBuf)
  audioBuffer.value = decoded
  duration.value = decoded.duration
  markerIn.value = 0
  markerOut.value = decoded.duration
  zoom.value = 1
  clearAllMarkers()
  viewStart.value = 0
  viewEnd.value = decoded.duration
  nextTick(drawWaveform)
}, { immediate: true })

function computeVisiblePeaks(canvasWidth: number): number[] {
  const buffer = audioBuffer.value
  if (!buffer || canvasWidth <= 0) return []
  const data = buffer.getChannelData(0)
  const sampleRate = buffer.sampleRate
  const startSample = Math.floor(viewStart.value * sampleRate)
  const endSample = Math.ceil(viewEnd.value * sampleRate)
  const totalSamples = endSample - startSample
  if (totalSamples <= 0) return []

  const buckets = Math.min(Math.round(canvasWidth), totalSamples)
  const samplesPerBucket = totalSamples / buckets
  const peaks: number[] = new Array(buckets)

  for (let i = 0; i < buckets; i++) {
    const from = startSample + Math.floor(i * samplesPerBucket)
    const to = startSample + Math.floor((i + 1) * samplesPerBucket)
    let max = 0
    for (let j = from; j < to && j < data.length; j++) {
      const abs = Math.abs(data[j])
      if (abs > max) max = abs
    }
    peaks[i] = max
  }
  return peaks
}

const cursorX = ref(-1)
const cursorTime = ref(-1)

const MARKER_COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF922B', '#CC5DE8', '#20C997', '#F06595']
const chopMarkers = ref<(number | null)[]>(Array.from({ length: 8 }, () => null))

const activeMarkerCount = computed(() => chopMarkers.value.filter((m) => m !== null).length)

function clearAllMarkers() {
  chopMarkers.value = Array.from({ length: 8 }, () => null)
}

function chopAtMarkers() {
  if (!audioBuffer.value || !selectedSample.value) return
  const buf = audioBuffer.value
  const baseName = selectedSample.value.name.replace(/\.(wav|aiff?)$/i, '')

  const times = chopMarkers.value.filter((m): m is number => m !== null).sort((a, b) => a - b)
  if (times.length === 0) return

  const cutPoints = [markerIn.value, ...times, markerOut.value]

  let idx = 1
  for (let i = 0; i < cutPoints.length - 1; i++) {
    const start = cutPoints[i]
    const end = cutPoints[i + 1]
    if (end - start < 0.001) continue
    addSampleFromBuffer(`${baseName}_m${idx}.wav`, buf, start, end)
    idx++
  }
}

watch([markerIn, markerOut, viewStart, viewEnd, playheadTime, cursorX, chopMarkers], () => {
  drawWaveform()
}, { deep: true })

function timeToX(time: number, w: number): number {
  return ((time - viewStart.value) / (viewEnd.value - viewStart.value)) * w
}

function xToTime(x: number, w: number): number {
  return viewStart.value + (x / w) * (viewEnd.value - viewStart.value)
}

function drawWaveform() {
  if (!import.meta.client) return
  const canvas = canvasRef.value
  if (!canvas || !audioBuffer.value) return
  const ctx = canvas.getContext('2d')!
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const w = rect.width
  const h = rect.height
  const peaks = computeVisiblePeaks(w)
  if (peaks.length === 0) return
  const barW = w / peaks.length
  const midY = h / 2

  ctx.clearRect(0, 0, w, h)

  const inX = timeToX(markerIn.value, w)
  const outX = timeToX(markerOut.value, w)

  ctx.fillStyle = 'rgba(10, 26, 26, 0.6)'
  ctx.fillRect(0, 0, Math.max(0, inX), h)
  ctx.fillRect(Math.min(w, outX), 0, w - Math.min(w, outX), h)

  ctx.fillStyle = 'rgba(0, 170, 136, 0.08)'
  const selLeft = Math.max(0, inX)
  const selRight = Math.min(w, outX)
  if (selRight > selLeft) ctx.fillRect(selLeft, 0, selRight - selLeft, h)

  for (let i = 0; i < peaks.length; i++) {
    const x = i * barW
    const barH = peaks[i] * midY * 0.9
    const isInSelection = (x + barW) >= inX && x <= outX
    ctx.fillStyle = isInSelection ? '#00AA88' : '#1a3a3a'
    ctx.fillRect(x, midY - barH, Math.max(barW - 1, 1), barH * 2)
  }

  if (inX >= -2 && inX <= w + 2) {
    ctx.fillStyle = '#00FFCC'
    ctx.fillRect(inX - 1.5, 0, 3, h)
    ctx.font = '10px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('IN', Math.max(12, Math.min(w - 12, inX)), 12)
  }

  if (outX >= -2 && outX <= w + 2) {
    ctx.fillStyle = '#00FFCC'
    ctx.fillRect(outX - 1.5, 0, 3, h)
    ctx.font = '10px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('OUT', Math.max(16, Math.min(w - 16, outX)), h - 4)
  }

  // Chop markers (1-8)
  for (let i = 0; i < chopMarkers.value.length; i++) {
    const t = chopMarkers.value[i]
    if (t === null) continue
    const mx = timeToX(t, w)
    if (mx < -2 || mx > w + 2) continue
    const color = MARKER_COLORS[i]
    ctx.fillStyle = color
    ctx.fillRect(mx - 1, 0, 2, h)
    ctx.font = 'bold 9px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = color
    const labelY = 12 + (i % 2) * 12
    ctx.fillText(String(i + 1), Math.max(6, Math.min(w - 6, mx)), labelY)
  }

  // Cursor position line + play icon
  if (cursorX.value >= 0 && cursorX.value <= w && playheadTime.value < 0) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(cursorX.value, 0)
    ctx.lineTo(cursorX.value, h)
    ctx.stroke()
    ctx.setLineDash([])

    const triSize = 8
    const triX = cursorX.value
    const triY = midY
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.beginPath()
    ctx.moveTo(triX - triSize * 0.4, triY - triSize)
    ctx.lineTo(triX + triSize * 0.8, triY)
    ctx.lineTo(triX - triSize * 0.4, triY + triSize)
    ctx.closePath()
    ctx.fill()
  }

  // Playhead
  if (playheadTime.value >= 0) {
    const phX = timeToX(playheadTime.value, w)
    if (phX >= 0 && phX <= w) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(phX - 1, 0, 2, h)
      ctx.beginPath()
      ctx.moveTo(phX - 5, 0)
      ctx.lineTo(phX + 5, 0)
      ctx.lineTo(phX, 6)
      ctx.closePath()
      ctx.fill()
    }
  }
}

// --- Cursor position (event handlers) ---
function onWaveformMouseMove(e: MouseEvent) {
  if (dragging.value || navDragging.value || isPreviewing.value) {
    cursorX.value = -1
    return
  }
  const rect = wrapperRef.value!.getBoundingClientRect()
  cursorX.value = e.clientX - rect.left
  cursorTime.value = xToTime(cursorX.value, rect.width)
}

function onWaveformMouseLeave() {
  cursorX.value = -1
  cursorTime.value = -1
}

if (import.meta.client) {
  useEventListener(document, 'keydown', (e: KeyboardEvent) => {
    if (!audioBuffer.value || cursorTime.value < 0) return
    const tag = (e.target as HTMLElement).tagName
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return

    if (e.key === 'i') {
      const t = Math.max(0, Math.min(markerOut.value - 0.001, cursorTime.value))
      markerIn.value = t
    } else if (e.key === 'o') {
      const t = Math.min(duration.value, Math.max(markerIn.value + 0.001, cursorTime.value))
      markerOut.value = t
    } else {
      const num = Number(e.key)
      if (num >= 1 && num <= 8) {
        e.preventDefault()
        e.stopPropagation()
        const t = Math.max(markerIn.value, Math.min(markerOut.value, cursorTime.value))
        const updated = [...chopMarkers.value]
        updated[num - 1] = updated[num - 1] === t ? null : t
        chopMarkers.value = updated
      }
    }
  })
}

// --- Zoom & pan ---
const navDragging = ref<'zoom' | null>(null)
const navStartY = ref(0)
const navStartX = ref(0)
const navStartZoom = ref(1)
const navStartViewStart = ref(0)
const navStartViewEnd = ref(0)
const navAnchorTime = ref(0)
const pointerDownClientX = ref(0)
const pointerDownClientY = ref(0)
const didDrag = ref(false)

function onPointerDown(e: PointerEvent) {
  if (!duration.value) return
  didDrag.value = false
  pointerDownClientX.value = e.clientX
  pointerDownClientY.value = e.clientY

  const rect = wrapperRef.value!.getBoundingClientRect()
  const x = e.clientX - rect.left
  const w = rect.width
  const inX = timeToX(markerIn.value, w)
  const outX = timeToX(markerOut.value, w)

  const threshold = 10
  const distIn = Math.abs(x - inX)
  const distOut = Math.abs(x - outX)
  const markersClose = Math.abs(outX - inX) < threshold * 3

  if (markersClose && (distIn < threshold || distOut < threshold)) {
    dragging.value = distIn <= distOut ? 'in' : 'out'
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    return
  }
  if (distIn < threshold) {
    dragging.value = 'in'
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    return
  }
  if (distOut < threshold) {
    dragging.value = 'out'
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    return
  }
  if (x > inX + threshold && x < outX - threshold) {
    dragging.value = 'region'
    dragStartX.value = e.clientX
    dragStartIn.value = markerIn.value
    dragStartOut.value = markerOut.value
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    return
  }

  navDragging.value = 'zoom'
  navStartY.value = e.clientY
  navStartX.value = e.clientX
  navStartZoom.value = zoom.value
  navStartViewStart.value = viewStart.value
  navStartViewEnd.value = viewEnd.value
  navAnchorTime.value = xToTime(x, w)
  e.preventDefault()
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  const dx = Math.abs(e.clientX - pointerDownClientX.value)
  const dy = Math.abs(e.clientY - pointerDownClientY.value)
  if (dx > 4 || dy > 4) didDrag.value = true

  if (dragging.value) {
    handleMarkerDrag(e)
    return
  }
  if (navDragging.value === 'zoom') {
    handleZoomPan(e)
    return
  }
}

function handleMarkerDrag(e: PointerEvent) {
  const rect = wrapperRef.value!.getBoundingClientRect()
  const w = rect.width
  const minGap = 0.001

  if (dragging.value === 'in') {
    const t = xToTime(e.clientX - rect.left, w)
    markerIn.value = Math.max(0, Math.min(markerOut.value - minGap, t))
  } else if (dragging.value === 'out') {
    const t = xToTime(e.clientX - rect.left, w)
    markerOut.value = Math.min(duration.value, Math.max(markerIn.value + minGap, t))
  } else if (dragging.value === 'region') {
    const dx = e.clientX - dragStartX.value
    const rect2 = wrapperRef.value!.getBoundingClientRect()
    const viewLen = viewEnd.value - viewStart.value
    const dt = (dx / rect2.width) * viewLen
    const regionLen = dragStartOut.value - dragStartIn.value
    let newIn = dragStartIn.value + dt
    let newOut = dragStartOut.value + dt
    if (newIn < 0) { newIn = 0; newOut = regionLen }
    if (newOut > duration.value) { newOut = duration.value; newIn = duration.value - regionLen }
    markerIn.value = newIn
    markerOut.value = newOut
  }
}

function applyZoom(newZoom: number, anchorTime: number, anchorScreenRatio: number) {
  newZoom = Math.max(1, Math.min(MAX_ZOOM, newZoom))
  zoom.value = newZoom
  const viewLen = duration.value / newZoom
  let newStart = anchorTime - anchorScreenRatio * viewLen
  let newEnd = newStart + viewLen
  if (newStart < 0) { newStart = 0; newEnd = viewLen }
  if (newEnd > duration.value) { newEnd = duration.value; newStart = Math.max(0, duration.value - viewLen) }
  viewStart.value = newStart
  viewEnd.value = newEnd
}

function handleZoomPan(e: PointerEvent) {
  const dy = navStartY.value - e.clientY
  const dx = e.clientX - navStartX.value
  const rect = wrapperRef.value!.getBoundingClientRect()

  const zoomSensitivity = 0.015
  let newZoom = navStartZoom.value * Math.pow(2, dy * zoomSensitivity)
  newZoom = Math.max(1, Math.min(MAX_ZOOM, newZoom))
  zoom.value = newZoom

  const viewLen = duration.value / newZoom
  const anchorRatio = (navStartX.value - rect.left) / rect.width
  let newStart = navAnchorTime.value - anchorRatio * viewLen

  const panSensitivity = (navStartViewEnd.value - navStartViewStart.value) / rect.width
  newStart += -dx * panSensitivity

  let newEnd = newStart + viewLen
  if (newStart < 0) { newStart = 0; newEnd = viewLen }
  if (newEnd > duration.value) { newEnd = duration.value; newStart = Math.max(0, duration.value - viewLen) }
  viewStart.value = newStart
  viewEnd.value = newEnd
}

function onPointerUp(e: PointerEvent) {
  if (!didDrag.value) {
    const rect = wrapperRef.value!.getBoundingClientRect()
    const clickTime = xToTime(e.clientX - rect.left, rect.width)
    playFromTime(clickTime)
  }
  dragging.value = null
  navDragging.value = null
}

// --- Scrollbar ---
const scrollbarDragging = ref(false)
const scrollbarDragStartX = ref(0)
const scrollbarDragStartViewStart = ref(0)

const scrollbarThumbStyle = computed(() => {
  if (duration.value === 0) return { left: '0%', width: '100%' }
  const left = (viewStart.value / duration.value) * 100
  const width = ((viewEnd.value - viewStart.value) / duration.value) * 100
  return { left: `${left}%`, width: `${width}%` }
})

function onScrollbarPointerDown(e: PointerEvent) {
  scrollbarDragging.value = true
  scrollbarDragStartX.value = e.clientX
  scrollbarDragStartViewStart.value = viewStart.value
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  e.preventDefault()
}

function onScrollbarPointerMove(e: PointerEvent) {
  if (!scrollbarDragging.value) return
  const track = scrollbarTrackRef.value!
  const trackW = track.getBoundingClientRect().width
  const dx = e.clientX - scrollbarDragStartX.value
  const dt = (dx / trackW) * duration.value
  const viewLen = viewEnd.value - viewStart.value
  let newStart = scrollbarDragStartViewStart.value + dt
  let newEnd = newStart + viewLen
  if (newStart < 0) { newStart = 0; newEnd = viewLen }
  if (newEnd > duration.value) { newEnd = duration.value; newStart = Math.max(0, duration.value - viewLen) }
  viewStart.value = newStart
  viewEnd.value = newEnd
}

function onScrollbarPointerUp() {
  scrollbarDragging.value = false
}

function onScrollbarTrackClick(e: MouseEvent) {
  if (e.target !== scrollbarTrackRef.value) return
  const track = scrollbarTrackRef.value!
  const rect = track.getBoundingClientRect()
  const clickRatio = (e.clientX - rect.left) / rect.width
  const viewLen = viewEnd.value - viewStart.value
  let newStart = clickRatio * duration.value - viewLen / 2
  let newEnd = newStart + viewLen
  if (newStart < 0) { newStart = 0; newEnd = viewLen }
  if (newEnd > duration.value) { newEnd = duration.value; newStart = Math.max(0, duration.value - viewLen) }
  viewStart.value = newStart
  viewEnd.value = newEnd
}

function onWheel(e: WheelEvent) {
  if (!duration.value) return
  e.preventDefault()
  const rect = wrapperRef.value!.getBoundingClientRect()
  const x = e.clientX - rect.left
  const anchorTime = xToTime(x, rect.width)
  const zoomDelta = e.deltaY > 0 ? 0.85 : 1.18
  applyZoom(zoom.value * zoomDelta, anchorTime, x / rect.width)
}

function formatTime(sec: number): string {
  const s = Math.floor(sec)
  const ms = Math.round((sec - s) * 1000)
  return `${s}.${String(ms).padStart(3, '0')}s`
}

// --- Playback ---
function playFromTime(startTime: number) {
  if (!audioBuffer.value) return
  stopPreview()

  const clampedStart = Math.max(0, Math.min(duration.value, startTime))
  const buf = audioBuffer.value
  const chopBuf = encodeWavFromBuffer(buf, clampedStart, duration.value)
  const blob = new Blob([chopBuf], { type: 'audio/wav' })
  const url = URL.createObjectURL(blob)
  previewAudio = new Audio(url)
  isPreviewing.value = true

  const playDuration = duration.value - clampedStart

  previewAudio.addEventListener('ended', () => {
    URL.revokeObjectURL(url)
    stopPreview()
  })

  previewAudio.play()

  const startedAt = performance.now()
  function tick() {
    if (!isPreviewing.value) return
    const elapsed = (performance.now() - startedAt) / 1000
    playheadTime.value = clampedStart + Math.min(elapsed, playDuration)
    if (elapsed < playDuration) {
      playheadRaf = requestAnimationFrame(tick)
    }
  }
  playheadRaf = requestAnimationFrame(tick)
}

function previewSelection() {
  if (!audioBuffer.value || !selectedSample.value) return

  if (isPreviewing.value) {
    stopPreview()
    return
  }

  stopPreview()
  const buf = audioBuffer.value
  const chopBuf = encodeWavFromBuffer(buf, markerIn.value, markerOut.value)
  const blob = new Blob([chopBuf], { type: 'audio/wav' })
  const url = URL.createObjectURL(blob)
  previewAudio = new Audio(url)
  isPreviewing.value = true

  const selStart = markerIn.value
  const selDuration = markerOut.value - markerIn.value

  previewAudio.addEventListener('ended', () => {
    URL.revokeObjectURL(url)
    stopPreview()
  })

  previewAudio.play()

  const startedAt = performance.now()
  function tick() {
    if (!isPreviewing.value) return
    const elapsed = (performance.now() - startedAt) / 1000
    playheadTime.value = selStart + Math.min(elapsed, selDuration)
    if (elapsed < selDuration) {
      playheadRaf = requestAnimationFrame(tick)
    }
  }
  playheadRaf = requestAnimationFrame(tick)
}

function encodeWavFromBuffer(buffer: AudioBuffer, startSec: number, endSec: number): ArrayBuffer {
  const sampleRate = buffer.sampleRate
  const channels = buffer.numberOfChannels
  const startFrame = Math.round(startSec * sampleRate)
  const endFrame = Math.round(endSec * sampleRate)
  const frameCount = endFrame - startFrame
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

function chopSample() {
  if (!audioBuffer.value || !selectedSample.value) return
  const buf = audioBuffer.value
  const baseName = selectedSample.value.name.replace(/\.(wav|aiff?)$/i, '')

  if (chopCount.value <= 1) {
    addSampleFromBuffer(`${baseName}_chop.wav`, buf, markerIn.value, markerOut.value)
    return
  }

  const regionDuration = markerOut.value - markerIn.value
  const sliceDuration = regionDuration / chopCount.value
  for (let i = 0; i < chopCount.value; i++) {
    const start = markerIn.value + i * sliceDuration
    const end = start + sliceDuration
    addSampleFromBuffer(`${baseName}_chop${i + 1}.wav`, buf, start, end)
  }
}

function detectTransients(buffer: AudioBuffer, startSec: number, endSec: number): number[] {
  const data = buffer.getChannelData(0)
  const sr = buffer.sampleRate
  const startFrame = Math.round(startSec * sr)
  const endFrame = Math.round(endSec * sr)

  const windowSize = Math.round(sr * 0.006)
  const hopSize = Math.round(sr * 0.003)

  const energies: number[] = []
  for (let i = startFrame; i < endFrame - windowSize; i += hopSize) {
    let sum = 0
    for (let j = 0; j < windowSize; j++) {
      const s = data[i + j] ?? 0
      sum += s * s
    }
    energies.push(sum / windowSize)
  }

  if (energies.length < 3) return []

  const peakEnergy = Math.max(...energies)
  const silenceThreshold = peakEnergy * 0.0001

  const flux: number[] = [0]
  for (let i = 1; i < energies.length; i++) {
    const prev = Math.max(energies[i - 1], silenceThreshold)
    const curr = energies[i]
    const ratio = curr / prev
    flux.push(ratio > 1 ? ratio - 1 : 0)
  }

  const adaptiveLen = Math.max(10, Math.round(0.15 * sr / hopSize))
  const adaptiveThreshold: number[] = new Array(flux.length).fill(0)
  for (let i = 0; i < flux.length; i++) {
    const lo = Math.max(0, i - adaptiveLen)
    const hi = Math.min(flux.length, i + adaptiveLen + 1)
    let sum = 0
    for (let j = lo; j < hi; j++) sum += flux[j]
    const localMean = sum / (hi - lo)
    adaptiveThreshold[i] = localMean * 3 + 0.5
  }

  const minGapFrames = Math.round(sr * 0.03)
  const candidates: { frame: number; strength: number }[] = []
  let lastFrame = -minGapFrames

  for (let i = 1; i < flux.length; i++) {
    if (flux[i] > adaptiveThreshold[i] && energies[i] > silenceThreshold * 10) {
      const frame = startFrame + i * hopSize
      if (frame - lastFrame >= minGapFrames) {
        candidates.push({ frame, strength: flux[i] })
        lastFrame = frame
      } else if (candidates.length > 0 && flux[i] > candidates[candidates.length - 1].strength) {
        candidates[candidates.length - 1] = { frame, strength: flux[i] }
        lastFrame = frame
      }
    }
  }

  return candidates.map((c) => c.frame)
}

function chopTransients() {
  if (!audioBuffer.value || !selectedSample.value) return
  const buf = audioBuffer.value
  const baseName = selectedSample.value.name.replace(/\.(wav|aiff?)$/i, '')
  const sr = buf.sampleRate

  const transientFrames = detectTransients(buf, markerIn.value, markerOut.value)
  if (transientFrames.length === 0) return

  const cutPoints = [
    Math.round(markerIn.value * sr),
    ...transientFrames,
    Math.round(markerOut.value * sr),
  ]

  let idx = 1
  for (let i = 0; i < cutPoints.length - 1; i++) {
    const chopStart = cutPoints[i] / sr
    const chopEnd = cutPoints[i + 1] / sr
    if (chopEnd - chopStart < 0.005) continue
    addSampleFromBuffer(`${baseName}_t${idx}.wav`, buf, chopStart, chopEnd)
    idx++
  }
}

const hasCustomSelection = computed(() =>
  audioBuffer.value !== null && (markerIn.value > 0.001 || markerOut.value < duration.value - 0.001),
)

function saveTrimmed() {
  if (!audioBuffer.value || !selectedSample.value || !hasCustomSelection.value) return
  const buf = audioBuffer.value
  const wavData = encodeWavFromBuffer(buf, markerIn.value, markerOut.value)
  const file = new File([wavData], selectedSample.value.name, { type: 'audio/wav' })
  replaceSampleFile(selectedSample.value.id, file)
}

const zoomPercent = computed(() => Math.round(zoom.value * 100))
</script>

<template>
  <div class="chop-view">
    <h2>Chop</h2>
    <template v-if="selectedSample">
      <div class="chop-view__info">
        <span class="chop-view__filename">{{ selectedSample.name }}</span>
        <span class="chop-view__zoom">{{ zoomPercent }}%</span>
        <span class="chop-view__duration">{{ formatTime(duration) }}</span>
      </div>
      <div
        ref="wrapperRef"
        class="chop-view__waveform"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @mousemove="onWaveformMouseMove"
        @mouseleave="onWaveformMouseLeave"
        @wheel="onWheel"
      >
        <canvas ref="canvasRef" class="chop-view__canvas" />
      </div>
      <div
        ref="scrollbarTrackRef"
        class="chop-view__scrollbar"
        @click="onScrollbarTrackClick"
      >
        <div
          class="chop-view__scrollbar-thumb"
          :style="scrollbarThumbStyle"
          @pointerdown="onScrollbarPointerDown"
          @pointermove="onScrollbarPointerMove"
          @pointerup="onScrollbarPointerUp"
        />
      </div>
      <div class="chop-view__markers">
        <span>IN: {{ formatTime(markerIn) }}</span>
        <span v-if="playheadTime >= 0" class="chop-view__playhead-time">{{ formatTime(playheadTime) }}</span>
        <span>Selection: {{ formatTime(markerOut - markerIn) }}</span>
        <span>OUT: {{ formatTime(markerOut) }}</span>
      </div>
      <div v-if="activeMarkerCount > 0" class="chop-view__chop-markers">
        <span
          v-for="(m, idx) in chopMarkers"
          :key="idx"
          class="chop-marker-badge"
          :class="{ 'chop-marker-badge--active': m !== null }"
          :style="m !== null ? { '--marker-color': MARKER_COLORS[idx] } : {}"
          @click="() => { if (m !== null) { const u = [...chopMarkers]; u[idx] = null; chopMarkers = u; } }"
        >
          {{ idx + 1 }}{{ m !== null ? ` ${formatTime(m)}` : '' }}
        </span>
        <button class="chop-marker-clear" @click="clearAllMarkers">Clear all</button>
      </div>
      <div class="chop-view__actions">
        <button
          class="chop-btn"
          :class="isPreviewing ? 'chop-btn--stop' : 'chop-btn--secondary'"
          @click="previewSelection"
        >
          <svg v-if="isPreviewing" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          {{ isPreviewing ? 'Stop' : 'Preview' }}
        </button>
        <button
          class="chop-btn chop-btn--save"
          :disabled="!hasCustomSelection"
          @click="saveTrimmed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
          Save
        </button>
        <div class="chop-count">
          <label>Slices</label>
          <select v-model.number="chopCount" class="chop-count__select">
            <option v-for="n in 8" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <button class="chop-btn chop-btn--primary" @click="chopSample">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
          Chop
        </button>
        <button class="chop-btn chop-btn--primary" @click="chopTransients">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          Transients
        </button>
        <button
          class="chop-btn chop-btn--primary"
          :disabled="activeMarkerCount < 1"
          @click="chopAtMarkers"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="7" y1="2" x2="7" y2="22" /></svg>
          Markers{{ activeMarkerCount > 0 ? ` (${activeMarkerCount})` : '' }}
        </button>
      </div>
    </template>
    <div v-else class="chop-view__empty">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v3" />
      </svg>
      <p>Select a sample to chop</p>
    </div>
  </div>
</template>

<style scoped>
.chop-view {
  background: var(--c-surface);
  border: 1px solid var(--c-playhead);
  border-radius: 12px;
  padding: 1rem;
}

.chop-view h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--c-text-active);
}

.chop-view__info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}

.chop-view__filename {
  font-size: 0.8rem;
  color: var(--c-text-active);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.chop-view__zoom {
  font-size: 0.65rem;
  color: var(--c-text-inactive);
  background: var(--c-off);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.chop-view__duration {
  font-size: 0.7rem;
  color: var(--c-text-inactive);
  flex-shrink: 0;
}

.chop-view__waveform {
  position: relative;
  height: 120px;
  background: var(--c-off);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  cursor: crosshair;
  touch-action: none;
}

.chop-view__canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.chop-view__scrollbar {
  position: relative;
  height: 14px;
  background: var(--c-off);
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  border-top: 1px solid var(--c-playhead);
}

.chop-view__scrollbar-thumb {
  position: absolute;
  top: 2px;
  height: 10px;
  background: var(--c-playhead);
  border-radius: 5px;
  cursor: grab;
  transition: background 0.1s;
  min-width: 20px;
}

.chop-view__scrollbar-thumb:hover,
.chop-view__scrollbar-thumb:active {
  background: var(--c-on);
  cursor: grabbing;
}

.chop-view__markers {
  display: flex;
  justify-content: space-between;
  margin-top: 0.4rem;
  font-size: 0.65rem;
  color: var(--c-text-inactive);
  font-variant-numeric: tabular-nums;
}

.chop-view__playhead-time {
  color: var(--c-text-active);
  font-weight: 700;
}

.chop-view__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.chop-btn {
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
}

.chop-btn--secondary {
  background: var(--c-playhead);
  color: var(--c-text-active);
}

.chop-btn--secondary:hover {
  background: var(--c-surface-raised);
}

.chop-btn--stop {
  background: var(--c-on);
  color: var(--c-off);
}

.chop-btn--stop:hover {
  background: #f44;
  color: var(--c-text-active);
}

.chop-btn--save {
  background: var(--c-playhead);
  color: var(--c-text-active);
}

.chop-btn--save:hover:not(:disabled) {
  background: var(--c-surface-raised);
}

.chop-btn--save:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.chop-btn--primary {
  background: var(--c-on);
  color: var(--c-off);
}

.chop-btn--primary:hover {
  background: var(--c-playhead-active);
  box-shadow: 0 0 12px rgba(0, 170, 136, 0.3);
}

.chop-count {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.chop-count label {
  font-size: 0.65rem;
  color: var(--c-text-inactive);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.chop-count__select {
  appearance: none;
  background: var(--c-off);
  border: 1px solid var(--c-playhead);
  border-radius: 4px;
  color: var(--c-text-active);
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  text-align: center;
  outline: none;
  transition: border-color 0.15s;
}

.chop-count__select:hover,
.chop-count__select:focus {
  border-color: var(--c-border);
}

.chop-view__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  height: 208px;
  color: var(--c-text-inactive);
  opacity: 0.5;
}

.chop-view__empty p {
  margin: 0;
  font-size: 0.85rem;
}

.chop-view__chop-markers {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.3rem;
}

.chop-marker-badge {
  font-size: 0.6rem;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  background: var(--c-playhead);
  color: var(--c-text-inactive);
  font-variant-numeric: tabular-nums;
  cursor: default;
  user-select: none;
}

.chop-marker-badge--active {
  background: color-mix(in srgb, var(--marker-color, #888) 25%, var(--c-off));
  color: var(--marker-color, #888);
  border: 1px solid var(--marker-color, #888);
  font-weight: 600;
  cursor: pointer;
}

.chop-marker-badge--active:hover {
  opacity: 0.7;
}

.chop-marker-clear {
  font-size: 0.6rem;
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  background: none;
  border: 1px solid var(--c-text-inactive);
  color: var(--c-text-inactive);
  cursor: pointer;
  margin-left: 0.2rem;
}

.chop-marker-clear:hover {
  border-color: var(--c-border);
  color: var(--c-text-active);
}
</style>
