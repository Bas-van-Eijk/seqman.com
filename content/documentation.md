# StepDeq Manual

## Table of Contents

1. [Getting Started](#getting-started)
2. [Button Layout](#button-layout)
3. [Basic Operation](#basic-operation)
4. [Views & Navigation](#views--navigation)
5. [Pattern System](#pattern-system)
6. [Drum Kits](#drum-kits)
7. [Effects](#effects)
8. [MIDI](#midi)
9. [Recording & Export](#recording--export)
10. [Customization](#customization)
11. [Save & Load](#save--load)
12. [Technical Specifications](#technical-specifications)

---

## Getting Started

### What is StepDeq?

StepDeq is a step sequencer and drum machine that runs entirely on the Elgato Stream Deck. It turns 15 buttons into a tactile beat-making instrument — no DAW required.

### Requirements

- **Elgato Stream Deck** with 15 buttons (standard 5×3 model)
- **macOS 12+** or **Windows 10+**
- Elgato Stream Deck application installed

### Installation

1. Open the Elgato Stream Deck application
2. Go to the Marketplace and search for **StepDeq**
3. Install the plugin
4. Drag any StepDeq action onto a profile — StepDeq will automatically fill all 15 buttons

### What makes StepDeq different

- **Hardware-first workflow** — No screen needed. Compose, perform, and mix beats by touch using the Stream Deck's physical buttons.
- **Zero-latency standalone** — Built-in audio engine plays samples directly. Plug in headphones and make music immediately.
- **DAW integration** — Send MIDI via IAC Driver to control Ableton, Logic, or any DAW. Sync to external MIDI clock.
- **10 performance FX** — Delay, reverb, filter, bitcrush, tape stop, fade out and more — triggered by holding buttons like a DJ controller.
- **Deep editing from 15 buttons** — Velocity, tuning, per-track FX chains, mixer, EQ, compressor, song mode — all accessible through Shift/Mod modifiers and intuitive view navigation.
- **Custom drum kits** — Load your own WAV samples. Organize them in folders with a simple JSON config.
- **Record & export** — Bounce your session to WAV or MP3 directly from the Stream Deck.

---

## Button Layout

StepDeq uses all 15 buttons on a standard Stream Deck (5×3 grid):

| Col 1 | Col 2 | Col 3 | Col 4 | Col 5 |
|-------|-------|-------|-------|-------|
| Step 1 | Step 2 | Step 3 | Step 4 | Track |
| Step 5 | Step 6 | Step 7 | Step 8 | Pattern |
| Shift | Sound | BPM | Mod/Roll | Back/Play |

### Button Roles

| Button | Normal | With Shift | With Mod |
|--------|--------|------------|----------|
| **Step 1–8** | Toggle steps on/off | Shift shortcuts | Context-dependent |
| **Track** | Select track / drum machine | Open info/settings view | Step page up |
| **Pattern** | Enter pattern select | Toggle song mode | Step page down |
| **Sound** | Hold to select sounds | Enter mute view | — |
| **BPM** | Increase BPM (+1) | Decrease BPM (−1) | Toggle FX view |
| **Mod/Roll** | Toggle mod modifier | Toggle roll mode | — |
| **Shift** | Hold for modifier | — | Copy pattern/slot |
| **Back/Play** | Play/stop (main view) / Back (sub-views) | Toggle recording | Enter live record overdub |

### Shift Shortcuts

Hold Shift and press a step button for quick access:

| Step | Label | Action |
|------|-------|--------|
| 1 | VERSION | Shows version number |
| 2 | VEL | Velocity edit view |
| 3 | EDIT+ | Track edit view |
| 4 | PGM | Program/kit browser |
| 5 | STP | Toggle keyboard mode |
| 6 | TRK FX | Per-track FX chain |
| 7 | MIXER | Mixer view |
| 8 | MSTR | Master EQ/compressor |

These shortcuts are user-configurable via `shift-shortcuts.json`.

---

## Basic Operation

### Playing and stopping

Press **Back/Play** to start the sequencer. While playing, a spinning tape reel animation plays on the Play button. To stop, press **Back/Play** again.

> **Safety feature**: During playback you must hold **Shift** and then press Back/Play to stop. This prevents accidental stops during performances.

### Toggling steps

In the main sequencer view, tap **Step 1–8** to toggle steps on or off. The playhead animates across the steps during playback.

### Changing tempo

Press **BPM** to increase tempo by 1 BPM. Hold **Shift + BPM** to decrease. The BPM range is 40–240.

### Selecting tracks

Press **Track** to open the track select view. The 8 step buttons show all drum machine slots. Tap to select the active track. The Track button displays the current track number and kit name (e.g. "T1 808").

### Selecting sounds

Hold **Sound** to open. Steps 1–8 correspond to the 8 sounds of the current drum machine. Tap to select which sound you're editing.

### Keyboard mode

Press **Shift + Step 5** (STP) to toggle keyboard mode, where steps trigger sounds in real-time instead of toggling pattern data.

---

## Views & Navigation

StepDeq organizes its interface into views. Enter views by pressing button combinations. Exit by pressing **Back/Play**.

### Main View: Sequencer

The default view. Steps 1–8 show the current pattern. Tap to toggle steps on/off.

- **Step pages**: Patterns can be 8, 16, 32, or 64 steps long. Use **Mod + Track** / **Mod + Pattern** to page through steps.

### Track Select

Press **Track** to open. Shows all 8 drum machine slots. While Track Select is open, holding **Sound** shows mute toggles for each drum machine.

### Pattern Select

Press **Pattern** to open. Shows up to 6 patterns per page across 8 pages (48 total). Steps 4 and 8 navigate pages. Tap a pattern to switch. Supports queued switching (immediate, 1–4 bar modes).

### Song Mode

Press **Shift + Pattern** to toggle between pattern mode and song mode. Song mode provides a 128-row × 8-column grid for chaining patterns into a full arrangement. Navigate the 2×4 viewport using Track (columns) and Pattern (rows).

### Mute View

Press **Shift + Sound** to enter mute view. Steps show mute status for each sound. Tap to toggle mute. The view stays locked until you exit.

### Velocity Edit

Press **Shift + Step 2** (VEL). Adjust per-step velocity values. With Mod held, edits per-step pitch instead.

### Track Edit

Press **Shift + Step 3** (EDIT+). Deep editing for the selected sound:

- Tuning / transpose
- Choke group assignment
- Envelope parameters
- Sound preview (press Sound button to audition)

### Mixer

Press **Shift + Step 7** (MIXER). Shows per-sound volume with VU meters. Use step buttons to adjust volume (Shift = decrease). With Mod held, adjusts per-drum-machine volume instead.

### Master Channel

Press **Shift + Step 8** (MSTR). Access the master output chain:

- **4-band EQ** — Low (200 Hz), Low-Mid (800 Hz), High-Mid (2.5 kHz), High (8 kHz), ±12 dB per band
- **Compressor** — Threshold, ratio, attack, release
- **Master FX chain** — Same FX types as per-track, applied to the master bus

### PGM Browser

Press **Shift + Step 4** (PGM). Browse and load drum kits:

- Navigate folders and kits across factory and user libraries
- 6 entries per page with page navigation on steps 4 and 8
- Tap to load a kit; Shift + tap to load and immediately enter note edit
- Supports hierarchical folder structure (drums, bass, etc.)

### BPM View

Displayed on the BPM button. Press BPM to increase tempo, Shift + BPM to decrease. Range: 40–240 BPM. In the settings grid, tap tempo is also available.

### Info / Settings Grid

Press **Shift + Track** to open. A paginated settings grid (2 pages) with:

| Setting | Description |
|---------|-------------|
| Rec Quantize | Off, 1/8, 1/16 for live recording |
| Metronome | Toggle metronome on/off (accent on beat 1) |
| Record | Start/stop master output recording |
| Project Load | 8 save slots |
| Clock Source | Internal or external MIDI clock |
| User Library | Open user sample folder |
| Swing | 50–75% swing amount |
| Project Save | Save to 8 slots |
| Version | Current version number |
| Pattern Length | Default 8, 16, 32, or 64 steps |
| Color Scheme | 8 preset + 8 user-customizable step color themes |
| Tape Animation | Toggle play button animation on/off |
| Pattern Change Mode | Immediate, 1–4 bar queued switching |
| Factory Reset | Long-press to reset all data |

### Track Settings

Per-drum-machine configuration:

- Output mode (MIDI / Sample)
- Transpose
- Per-DM FX chain
- MIDI input channel
- MIDI output channel

---

## Pattern System

### Patterns

StepDeq supports **48 patterns** across 8 pages (6 patterns per page). Each pattern has independent data for all 8 tracks.

- Press **Pattern** to open pattern select
- Steps 1–3 and 5–7 show the 6 patterns on the current page
- Steps 4 and 8 navigate between pages
- Tap a pattern to switch

### Step pages

Each pattern can be **8, 16, 32, or 64 steps** long. Use **Mod + Track** to page up and **Mod + Pattern** to page down through step groups.

### Pattern change modes

Configure how patterns switch during playback:

- **Immediate** — Switch instantly
- **1 Bar** — Queue change, switch after 1 bar
- **2 Bar** — Queue change, switch after 2 bars
- **3 Bar** — Queue change, switch after 3 bars
- **4 Bar** — Queue change, switch after 4 bars

### Song Mode

Press **Shift + Pattern** to toggle. Song mode provides a **128-row × 8-column** grid for chaining patterns into a full arrangement.

- Navigate the 2×4 viewport using Track (columns) and Pattern (rows)
- Assign patterns from your 48-pattern library to each song slot
- When switching from pattern mode to song mode while playing, the sequencer waits until the next bar for a smooth transition

### Live Record Mode

Press **Mod + Play** during playback to enter live record overdub. Finger-drum on steps 1–8 to record hits into the pattern in real time.

- **Quantize options**: Off, 1/8, 1/16
- **Mod** during live record adds drum rolls
- **Track** button arms pattern clear
- **Back/Play** exits live record

### Roll / Retrigger Mode

Press **Shift + Mod** to toggle. When active, holding a step button triggers rapid-fire repeats at adjustable rates: 1/32, 1/24, 1/16, 1/12, 1/8, 1/4, 1/2. Use Track to increase rate, Pattern to decrease.

---

## Drum Kits

### Factory Kits

StepDeq ships with classic drum machine kits:

- **TR-808** — Legendary analog sounds
- **TR-909** — Dance music classic
- **TR-606** — Compact drum machine
- **DX** — Digital FM drum sounds
- **Klomp** — Electronic percussion
- **303** — Bass synthesizer (chromatic)
- **101 Essential** — Analog bass (chromatic)

### Custom Kits

Create your own kits in the user directory:

- **macOS**: `~/Library/Application Support/com.seqman.stepdeq/kits/`
- **Windows**: `%APPDATA%\com.seqman.stepdeq\kits\`

Each kit is a folder containing WAV samples and a `kit.json`:

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

### Choke Groups

Sounds in the same choke group (1–8) cut each other off — use this for open/closed hi-hat pairs. Set to 0 for no choking.

### Loading Kits

Press **Shift + Step 4** (PGM) to open the kit browser. Navigate folders and tap to load. **Shift + tap** loads the kit and enters note edit immediately.

---

## Effects

### Performance FX

Press **Mod + BPM** to enter the FX view. 10 slots are available:

| Slot | Button | FX Type |
|------|--------|---------|
| 1–8 | Step 1–8 | Configurable |
| 9 | Pattern | Fade Out (ghost animation) |
| 10 | Track | Tape Stop (volcano animation) |

**Hold** a slot button to activate the effect. **Release** to deactivate. Effects ramp in/out smoothly.

**Shift + slot** enters the FX parameter editor for that slot, where steps become parameter knobs.

#### Available Performance FX

| Type | Label | Description |
|------|-------|-------------|
| Delay | DELAY | Tempo-synced echo |
| Bitcrush | CRUSH | Lo-fi bit reduction |
| Low-pass filter | LPF | Removes high frequencies |
| High-pass filter | HPF | Removes low frequencies |
| Reverb | VERB | Spatial reverb |
| OTT | OTT | Over-the-top multiband compression |
| Drum buss | DBUSS | Drum bus processing |
| Tape stop | TAPE | Vinyl slowdown effect |
| Fade out | FADE | Master volume fade to silence |

### Per-Track FX Chain

Press **Shift + Step 6** (TRK FX) or enter via Track Settings. Apply FX per sound or per drum machine:

| Type | Label | Description |
|------|-------|-------------|
| Chorus | CHRS | Stereo chorus |
| Filter | FLTR | Resonant filter |
| Delay | DLY | Echo effect |
| Compressor | COMP | Dynamics control |
| Wah-wah | WAH | Auto-wah |
| Tremolo | TREM | Volume modulation |
| Phaser | PHSR | Phase shifting |
| Bitcrusher | CRSH | Bit reduction |
| Moog filter | MOOG | Ladder filter emulation |
| Ping-pong delay | PPNG | Stereo bouncing delay |
| Panner | PAN | Auto-panning |
| Gain | GAIN | Volume boost/cut |
| Overdrive | OD | Saturation/distortion |
| Cabinet | CAB | Speaker cabinet simulation |
| 4-band EQ | EQ | Parametric equalizer |
| Limiter | LIM | Brick-wall limiter |

### Master Channel

Press **Shift + Step 8** (MSTR) to access the master output chain:

- **4-band EQ** — Low (200 Hz), Low-Mid (800 Hz), High-Mid (2.5 kHz), High (8 kHz), ±12 dB per band
- **Compressor** — Threshold, ratio, attack, release
- **Master FX chain** — Same FX types as per-track, applied to the master bus

---

## MIDI

### Output

StepDeq sends MIDI note on/off messages through the system's virtual MIDI ports. It auto-detects ports named "StreamDeck" or "IAC", falling back to the first available port.

Each drum machine can be assigned its own MIDI output channel (1–16) via Track Settings.

### Input

- **MIDI Clock**: Sync to external clock (24 PPQ). Automatically derives BPM.
- **Start/Stop/Continue**: Responds to transport messages.
- **Note input**: External MIDI notes can trigger sounds.
- **Per-DM MIDI input channels** configurable via Track Settings.

### Setting up IAC Driver (macOS)

To send MIDI from StepDeq to a DAW on the same Mac:

1. Open **Audio MIDI Setup** (Applications → Utilities)
2. Go to **Window → Show MIDI Studio**
3. Double-click **IAC Driver**
4. Check **Device is online**
5. The port will appear as a MIDI destination in your DAW

StepDeq automatically detects IAC ports. In your DAW, select the IAC Driver as a MIDI input.

---

## Recording & Export

StepDeq can record the master output directly:

1. Open Info/Settings (**Shift + Track**)
2. Tap the Record setting, or press Shift on it to configure format/quality
3. Start playback — recording captures everything
4. Stop recording to save

### Formats

- **WAV** — 16-bit, 24-bit, or 32-bit
- **MP3** — 128, 192, 256, or 320 kbps

### Record Settings

Accessed via Shift on the Record item in settings:

- **Format**: WAV or MP3
- **MP3 Bitrate**: 128, 192, 256, or 320 kbps
- **WAV Bit Depth**: 16, 24, or 32-bit

### Output location

- **macOS**: `~/Library/Application Support/com.seqman.stepdeq/recordings/`
- **Windows**: `%APPDATA%\com.seqman.stepdeq\recordings\`

Files are named `stepdeq_YYYY-MM-DD_HH-MM-SS.wav` (or `.mp3`).

---

## Customization

### Step Color Schemes

8 built-in presets: Classic, Modern, BPM Green, Sunset, Cyberpunk, Mono, Ocean, Rainbow.

8 user-customizable schemes (via the Stream Deck Property Inspector):

- Off/On colors
- Playhead colors (inactive/active)
- Text colors
- Border color

### Property Inspector Settings

Access by clicking any StepDeq button in the Stream Deck application:

- **Output Mode** — MIDI or Sample
- **Samples Folder** — Custom WAV folder path
- **User Color Schemes (U1–U8)** — Full color customization per scheme
- **Modifier Button Colors** — Shift, Roll and Page button appearance

### Animations

- **Tape reels** — Spinning reel animation on the Play button (BPM-synced)
- **Maneki Neko** — Lucky cat animation on Shift + Track (info button)
- **Ghost** — Pixel-art ghost on the Fade Out FX slot
- **Volcano** — Pixel-art volcano on the Tape Stop FX slot

---

## Save & Load

### Auto-save

All changes are saved automatically to the active project slot.

### 8 Project Slots

Full state is preserved per slot:

- All patterns and track data
- BPM, swing, output mode
- Clock source
- Kit assignments
- Song arrangement
- Master EQ & compressor settings
- Color scheme preferences

### File Location

- **macOS**: `~/Library/Application Support/com.seqman.stepdeq/`
- **Windows**: `%APPDATA%\com.seqman.stepdeq\`

---

## Technical Specifications

| Spec | Detail |
|------|--------|
| Platform | Elgato Stream Deck (15 buttons) |
| Runtime | Node.js 20 via Stream Deck SDK |
| Audio engine | Web Audio API (`node-web-audio-api`) |
| MIDI | easymidi / @julusian/midi |
| Rendering | Dynamic SVG generation (off-thread worker) |
| Language | TypeScript |
| Bundler | Rollup |
| OS support | macOS 12+, Windows 10+ |
| BPM range | 40–240 |
| Patterns | 48 (8 pages × 6 per page) |
| Steps per pattern | 8, 16, 32, or 64 |
| Tracks per pattern | 8 |
| Song length | 128 bars × 8 drum machines |
| Performance FX slots | 10 |
| Per-track FX types | 16 |
