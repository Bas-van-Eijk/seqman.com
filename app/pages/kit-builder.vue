<script setup lang="ts">
import JSZip from "jszip";

const { slots, zones, kitType, setKitType } = useSamples();

const packName = ref("Custom Kit");
const packAuthor = ref("Custom");

const hasFilledSlots = computed(() => slots.value.some((s) => s.sample));

const keysZonesList = computed(() => {
  const fromZones = zones.value.map((z) => ({
    sample: z.sample,
    rootNote: z.rootNote,
  }));
  const seen = new Set(fromZones.map((z) => `${z.sample.id}:${z.rootNote}`));
  const fromPads = slots.value
    .filter((s) => s.sample && !seen.has(`${s.sample.id}:${s.rootNote}`))
    .map((s) => ({ sample: s.sample!, rootNote: s.rootNote }));
  return [...fromZones, ...fromPads].sort((a, b) => a.rootNote - b.rootNote);
});

const canDownload = computed(() => {
  if (kitType.value === "drum") return hasFilledSlots.value;
  return keysZonesList.value.length > 0;
});

async function downloadPack() {
  const zip = new JSZip();

  if (kitType.value === "drum") {
    const tracks = slots.value.map((slot) => ({
      sample: slot.sample?.name ?? "",
      chokeGroup: slot.chokeGroup,
    }));

    const manifest = {
      name: packName.value,
      author: packAuthor.value,
      tracks,
    };

    zip.file("kit.json", JSON.stringify(manifest, null, 2));

    for (const slot of slots.value) {
      if (slot.sample) {
        zip.file(slot.sample.name, slot.sample.file);
      }
    }
  } else {
    const allZones = keysZonesList.value;
    const zonesJson = allZones.map((z) => ({
      sample: z.sample.name,
      rootNote: z.rootNote,
    }));

    const tracks = slots.value.map((slot) => {
      const matchingZone = allZones.find((z) => z.rootNote === slot.rootNote);
      const defaultSample = matchingZone?.sample.name ?? allZones[0]?.sample.name ?? "";

      return {
        sample: slot.sample?.name ?? defaultSample,
        chokeGroup: slot.chokeGroup,
        rootNote: slot.rootNote,
        zones: zonesJson,
      };
    });

    const manifest = {
      name: packName.value,
      author: packAuthor.value,
      type: "multisample",
      tracks,
    };

    zip.file("kit.json", JSON.stringify(manifest, null, 2));

    const addedFiles = new Set<string>();
    for (const z of allZones) {
      if (!addedFiles.has(z.sample.name)) {
        zip.file(z.sample.name, z.sample.file);
        addedFiles.add(z.sample.name);
      }
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${packName.value.replace(/\s+/g, "-").toLowerCase()}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="kb-theme">
    <div class="kb-page">
      <SampleChopView class="kb-page__chop" />
      <div class="kb-page__layout">
        <SampleDropZone />
        <SampleSlots />
        <div class="kb-right-panel">
          <PadInspector />
          <ZonesEditor v-if="kitType === 'keys'" />
          <div class="kb-export-section">
            <h2>Export</h2>
            <div class="kb-kit-type-toggle">
              <button
                class="kb-kit-type-btn"
                :class="{ 'kb-kit-type-btn--active': kitType === 'drum' }"
                @click="setKitType('drum')"
              >
                Drum Kit
              </button>
              <button
                class="kb-kit-type-btn"
                :class="{ 'kb-kit-type-btn--active': kitType === 'keys' }"
                @click="setKitType('keys')"
              >
                Keys Kit
              </button>
            </div>
            <div class="kb-export-fields">
              <div class="kb-export-field">
                <label for="pack-name">Kit name</label>
                <input id="pack-name" v-model="packName" type="text">
              </div>
              <div class="kb-export-field">
                <label for="pack-author">Author</label>
                <input id="pack-author" v-model="packAuthor" type="text">
              </div>
            </div>
            <button
              class="kb-download-btn"
              :disabled="!canDownload"
              @click="downloadPack"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download .zip
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kb-theme {
  --c-off: #0a1a1a;
  --c-on: #00AA88;
  --c-playhead: #1a3a3a;
  --c-playhead-active: #00DDAA;
  --c-text-active: #FFFFFF;
  --c-text-inactive: #44AA88;
  --c-border: #00FFCC;
  --c-surface: #0d2222;
  --c-surface-raised: #102b2b;
  margin: -3.5rem 0 -2rem;
  padding: 0;
}

.kb-page {
  min-height: 100vh;
  background: var(--c-off);
  color: var(--c-text-active);
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  padding: 1.5rem;
}

.kb-page__chop {
  margin-bottom: 1.5rem;
}

.kb-page__layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  gap: 1.5rem;
}

.kb-right-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.kb-export-section {
  background: var(--c-surface);
  border: 1px solid var(--c-playhead);
  border-radius: 12px;
  padding: 1rem;
}

.kb-export-section h2 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--c-text-active);
}

.kb-kit-type-toggle {
  display: flex;
  gap: 0;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--c-playhead);
}

.kb-kit-type-btn {
  flex: 1;
  padding: 0.45rem 0.75rem;
  border: none;
  background: var(--c-off);
  color: var(--c-text-inactive);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.kb-kit-type-btn--active {
  background: var(--c-on);
  color: var(--c-off);
}

.kb-kit-type-btn:not(.kb-kit-type-btn--active):hover {
  background: var(--c-playhead);
  color: var(--c-text-active);
}

.kb-export-fields {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.kb-export-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.kb-export-field label {
  font-size: 0.7rem;
  color: var(--c-text-inactive);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.kb-export-field input {
  background: var(--c-off);
  border: 1px solid var(--c-playhead);
  border-radius: 8px;
  color: var(--c-text-active);
  font-size: 0.85rem;
  padding: 0.5rem 0.65rem;
  outline: none;
  transition: border-color 0.15s;
}

.kb-export-field input:focus {
  border-color: var(--c-border);
}

.kb-download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.7rem 1rem;
  background: var(--c-on);
  border: none;
  border-radius: 10px;
  color: var(--c-off);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.kb-download-btn:hover:not(:disabled) {
  background: var(--c-playhead-active);
  box-shadow: 0 0 20px rgba(0, 170, 136, 0.3);
}

.kb-download-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .kb-page__layout {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .kb-page__layout {
    grid-template-columns: 1fr;
  }
}
</style>
