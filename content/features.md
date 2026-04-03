# StepDeq - Stream Deck Step Sequencer

A powerful 8-track, 8-step drum sequencer plugin for Elgato Stream Deck.

## Core Features

### Sequencer

- **8 Tracks** — Each track can trigger a different sound/note
- **64 Steps per pattern** — Classic drum machine style sequencing
- **48 Patterns** — Store different beats across 8 pages (6 patterns per page)
- **Variable BPM** — 40-300 BPM with tap tempo support
- **Swing** — Adjustable swing amount (50-75%) for groove

### Playback Modes

- **MIDI Output** — Send MIDI notes to your DAW or hardware
- **Sample Output** — Play WAV files directly (no DAW required)
- **Internal Clock** — Standalone operation
- **External Clock** — Sync to MIDI clock from DAW/hardware

### Pattern System

- **48 Patterns** — 8 pages × 6 patterns per page, each with independent track data
- **Paginated Navigation:**
  - Buttons 1-3 and 5-7 show patterns on current page
  - Button 4 (↑) navigates to previous page
  - Button 8 (↓) navigates to next page
  - Page indicator dots show current position (1-8)
- **Pattern Change Modes:**
  - Immediate — Switch instantly
  - 1 Bar — Queue change, switch after 1 bar
  - 2 Bar — Queue change, switch after 2 bars
  - 3 Bar — Queue change, switch after 3 bars
  - 4 Bar — Queue change, switch after 4 bars
- **Song Mode** — Chain patterns in 48 song slots (8 pages × 6 slots)

### Track Features

- **Per-track volume** — Individual volume control (0-127)
- **Per-track mute** — Mute individual tracks
- **Retrigger/Roll** — Drum roll effect with adjustable rates:
  - 1/32, 1/24, 1/16, 1/12, 1/8, 1/4, 1/2
- **Choke Groups** — 8 choke groups for hi-hat behavior (0 = none)
- **Sound Selection** — Choose from 8 sounds per track

---

## Drum Kit System

### Bundled Kits

- **TR-606** — Classic Roland drum machine sounds (fully included)
- **TR-707** — Digital drum machine (kit.json ready, add samples)
- **TR-808** — Legendary analog drum machine (kit.json ready, add samples)
- **TR-909** — Dance music staple (kit.json ready, add samples)
- **101-ess** — 101 classic (kit.json ready, add samples)

### Kit Selection (Shift+4)

- Press **Shift + Button 4** to open kit selection view
- 8 kit slots displayed on step buttons
- Active kit highlighted
- Tap a kit to load it instantly
- Press Settings button to exit kit view

### Custom Kits

Create your own kits by adding a folder to the user kits directory:

**macOS:** `~/Library/Application Support/com.app.name/kits/`
**Windows:** `%APPDATA%\com.app.name\kits\`

Each kit folder needs:

- `kit.json` — Kit configuration file
- Sample files (WAV format)

**kit.json format:**

```json
{
  "name": "My Kit",
  "author": "Your Name",
  "tracks": [
    { "sample": "kick.wav", "chokeGroup": 0 },
    { "sample": "snare.wav", "chokeGroup": 0 },
    { "sample": "hat-closed.wav", "chokeGroup": 1 },
    { "sample": "hat-open.wav", "chokeGroup": 1 },
    { "sample": "tom-lo.wav", "chokeGroup": 0 },
    { "sample": "tom-hi.wav", "chokeGroup": 0 },
    { "sample": "cymbal.wav", "chokeGroup": 0 },
    { "sample": "clap.wav", "chokeGroup": 0 }
  ]
}
```

**Choke Groups:** Tracks in the same choke group (1-4) will cut each other off. Use 0 for no choke. Typical use: closed and open hi-hats in the same group.

---

## Audio Engine (Sample Mode)

### Sample Playback

- **Low-latency playback** — Optimized for real-time performance
- **Polyphonic** — Multiple samples can play simultaneously
- **WAV support** — Load your own sample folders
- **Default samples** — Built-in drum kit included

### Master Channel

- **4-Band EQ:**
  - Low (200 Hz)
  - Low-Mid (800 Hz)
  - High-Mid (2.5 kHz)
  - High (8 kHz)
  - Each band: -12dB to +12dB

- **Compressor/Limiter:**
  - Threshold: -60dB to 0dB
  - Ratio: 1:1 to 20:1
  - Attack: 0.1ms to 100ms
  - Release: 10ms to 1000ms

### VU Meters

- Real-time per-track level visualization in mixer view

---

## Visual Customization

### Step Button Color Schemes

**8 Preset Schemes:**

1. **CLASSIC** — Bright green/yellow/orange (original)
2. **MODERN** — Subtle blue-based
3. **BPM GREEN** — Like the BPM button style
4. **SUNSET** — Warm oranges and reds
5. **CYBERPUNK** — Neon pink and cyan
6. **MONO** — Elegant grayscale
7. **OCEAN** — Deep blues and teals
8. **RAINBOW** — Over the top pinks, purples, yellows

**8 User Custom Schemes:**

1. **NEON MINT** — Fresh mint greens with cyan
2. **LAVENDER** — Soft purples and pinks
3. **BLOOD MOON** — Deep reds and crimsons
4. **GOLDEN** — Warm golds and ambers
5. **ELECTRIC** — Vivid electric blues
6. **FOREST** — Earthy greens and browns
7. **CORAL** — Tropical corals and teals
8. **MIDNIGHT** — Deep navy with silver

Each user scheme is fully customizable via the Property Inspector:

- Off color (inactive step)
- On color (active step)
- Playhead color (current position, inactive)
- Playhead+Active color (current position, active)
- Text colors (active/inactive)
- Border color

### Modifier Button Colors

Customize the appearance of:

- **Shift Button** — Active/inactive background and border
- **Roll Button** — Active/inactive background, border, and text
- **Page Button** — Background and border

---

## Views & Modes

### Main Views

- **Sequencer** — Step buttons show pattern, tap to toggle steps
- **Mixer** — Per-track volume faders with VU meters
- **Pattern Select** — Choose from 8 patterns
- **Song Mode** — Chain patterns in song slots

### Edit Modes

- **Note Edit** — Change the MIDI note for each track
- **Track Edit** — Adjust sound, volume, retrigger, choke group
- **Sound Select** — Pick from 8 sounds per track
- **Master EQ** — 4-band parametric EQ
- **Master Compressor** — Dynamics processing

### Settings View

- Clock source (Internal/External)
- Output mode (MIDI/Sample)
- Step color scheme selection
- Pattern change mode
- Swing amount
- Save/Load project slots

---

## Save & Load

### Project Persistence

- **Auto-save** — Changes saved automatically
- **8 Save Slots** — Store different projects
- **Full State Saved:**
  - All 8 patterns with track data
  - BPM, swing, output mode
  - Clock source
  - Sample folder path
  - Song slots
  - Master EQ & compressor settings
  - Color scheme preferences
  - Modifier button colors

### File Location

- **macOS:** `~/Library/Application Support/com.seqman.stepdeq/`
- **Windows:** `%APPDATA%\com.seqman.stepdeq\`

---

## Button Layout

### Recommended Stream Deck Layout (4x2)

```
[Step 1] [Step 2] [Step 3] [Step 4]
[Step 5] [Step 6] [Step 7] [Step 8]
```

### Additional Buttons

- **Play/Stop** — Start/stop sequencer
- **BPM** — Display and adjust tempo
- **Pattern** — Pattern selection
- **Settings** — Access settings view
- **Shift** — Modifier for secondary functions
- **Mod/Roll** — Activate drum roll mode
- **Page** — Switch step pages (for 16+ steps)
- **Mute** — Track mute controls

---

## Property Inspector Settings

Access by clicking any StepDeq button in Stream Deck:

### General

- **Output Mode** — MIDI or Sample
- **Samples Folder** — Custom WAV folder path

### User Color Schemes (U1-U8)

- Name
- Off/On colors
- Playhead colors
- Text colors
- Border color

### Modifier Button Colors

- Shift button colors
- Roll button colors
- Page button colors

---

## Keyboard Shortcuts (via Shift)

When holding Shift, step buttons show hint labels:

| Button | Shortcut | Function                  |
| ------ | -------- | ------------------------- |
| 1      | Shift+1  | Note/Sample Edit View     |
| 2      | Shift+2  | Mixer View                |
| 3      | Shift+3  | Track Edit View           |
| 4      | Shift+4  | Kit Selection View        |
| 8      | Shift+8  | Master EQ/Compressor View |

Other Shift combinations:

- **Shift + Sound** — Toggle mute view
- **Shift + Play** — Toggle BPM view

---

## Technical Specifications

- **Node.js** runtime via Stream Deck SDK
- **Web Audio API** for sample playback
- **MIDI** via easymidi library
- **SVG** dynamic button rendering
- **TypeScript** codebase
- **Rollup** bundler

---

## Version History

See CHANGELOG.md for detailed version history.
