# StepDeq Features

A powerful 8-track step sequencer and drum machine for Elgato Stream Deck.

---

## Sequencer

- **8 Tracks** — Each track triggers a different sound or MIDI note
- **Up to 64 steps per pattern** — 8, 16, 32, or 64 step lengths
- **48 Patterns** — 8 pages × 6 patterns each, with independent track data
- **BPM range** — 40–240 BPM
- **Swing** — Adjustable swing amount (50–75%) for groove

## Playback Modes

- **Sample Output** — Built-in audio engine plays WAV files directly, no DAW required
- **MIDI Output** — Send MIDI notes to your DAW or hardware synths
- **Internal Clock** — Standalone operation
- **External Clock** — Sync to MIDI clock from your DAW or hardware

## Pattern System

- **48 Patterns** — 8 pages × 6 patterns per page
- **Pattern change modes** — Immediate, or queued switching at 1–4 bar boundaries
- **Song Mode** — Chain patterns across 128 bars × 8 drum machines for full arrangements

## Performance

- **Live Record** — Finger-drum on Step 1–8 to record hits in real time with quantize options (off, 1/8, 1/16)
- **Roll / Retrigger** — Hold a step for rapid-fire repeats at rates from 1/32 to 1/2
- **Keyboard Mode** — Steps trigger sounds in real-time instead of toggling pattern data
- **10 Performance FX** — Delay, reverb, filter, bitcrush, tape stop, fade out and more — hold to activate, release to kill

## Track Features

- **Per-track volume** with real-time VU meters
- **Per-track mute** — Independent mute per sound
- **Choke groups** — 8 groups for hi-hat behavior (open/closed pairs)
- **Per-track FX chain** — 16 FX types including chorus, filter, delay, compressor, phaser, overdrive and more
- **Velocity editing** — Per-step velocity control
- **Tuning & transpose** — Per-sound pitch adjustments

## Drum Kit System

### Factory Kits

- **TR-808** — Legendary analog sounds
- **TR-909** — Dance music classic
- **TR-606** — Compact drum machine
- **DX** — Digital FM drum sounds
- **Klomp** — Electronic percussion
- **303** — Bass synthesizer (chromatic)
- **101 Essential** — Analog bass (chromatic)

### Custom Kits

Load your own WAV samples with a simple `kit.json` config:

- **macOS:** `~/Library/Application Support/com.seqman.stepdeq/kits/`
- **Windows:** `%APPDATA%\com.seqman.stepdeq\kits\`

## Audio Engine

- **Low-latency playback** — Web Audio API optimized for real-time performance
- **Polyphonic** — Multiple samples play simultaneously
- **Master 4-band EQ** — Low, Low-Mid, High-Mid, High (±12 dB per band)
- **Master Compressor** — Threshold, ratio, attack, release
- **Master FX chain** — Same 16 FX types available on the master bus

## Recording & Export

- **WAV** — 16-bit, 24-bit, or 32-bit
- **MP3** — 128, 192, 256, or 320 kbps
- Output saved to the StepDeq application folder

## Visual Customization

### 16 Color Schemes

- 8 preset schemes: Classic, Modern, BPM Green, Sunset, Cyberpunk, Mono, Ocean, Rainbow
- 8 user-customizable schemes via the Property Inspector
- Full control over off/on colors, playhead colors, text colors, and border color

### Animations

- Tape reel animation on the Play button (BPM-synced)
- Maneki Neko, Ghost, and Volcano pixel-art animations on special buttons

### Modifier Button Colors

- Customize Shift, Roll, and Page button appearance

## Save & Load

- **Auto-save** — Changes saved automatically
- **8 project slots** — Full state preserved per slot (patterns, BPM, kits, FX, song, EQ, colors)

## Keyboard Shortcuts

Hold Shift + a step button for quick access:

| Step | Label | Function |
|------|-------|----------|
| 1 | VERSION | Show version number |
| 2 | VEL | Velocity edit view |
| 3 | EDIT+ | Track edit view |
| 4 | PGM | Kit browser |
| 5 | STP | Toggle keyboard mode |
| 6 | TRK FX | Per-track FX chain |
| 7 | MIXER | Mixer view |
| 8 | MSTR | Master EQ/compressor |

---

## Technical Specifications

| Spec | Detail |
|------|--------|
| Platform | Elgato Stream Deck (15 buttons, 5×3) |
| Runtime | Node.js 20 via Stream Deck SDK |
| Audio | Web Audio API (`node-web-audio-api`) |
| MIDI | easymidi / @julusian/midi |
| Rendering | Dynamic SVG generation |
| Language | TypeScript |
| OS | macOS 12+, Windows 10+ |
