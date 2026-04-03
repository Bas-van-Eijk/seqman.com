# Frequently Asked Questions (FAQ)

## Display & Hardware

### Q: Why does my Stream Deck display go blank/screensaver when my computer sleeps?

**This is expected behavior.** The Stream Deck hardware follows the screensaver settings from:

1. The Elgato Stream Deck application
2. Your operating system's display/energy settings

**Important:** The sequencer continues to play audio correctly even when the display is off. Only the visual display on the Stream Deck is affected.

**To fix this:**

#### Option 1: Adjust Stream Deck Settings (Recommended)

1. Open the **Elgato Stream Deck** application
2. Go to **Preferences** (Mac: `Cmd + ,`, Windows: `Ctrl + ,`)
3. Look for **Display** or **Screensaver** settings
4. Increase the timeout or disable the screensaver

#### Option 2: Adjust OS Settings

**macOS:**

1. Open **System Settings** → **Displays**
2. Click **Advanced**
3. Adjust "Turn display off after" to a longer duration
4. Or use **System Settings** → **Lock Screen** to adjust screensaver timing

**Windows:**

1. Open **Settings** → **System** → **Power & Sleep**
2. Adjust "Screen" timeout settings
3. Or go to **Personalization** → **Lock Screen** → **Screen saver settings**

#### Option 3: Use a Keep-Awake Utility

For performances or long sessions:

- **macOS**: Use apps like Amphetamine, Caffeine, or KeepingYouAwake
- **Windows**: Use apps like Caffeine or Don't Sleep

---

## Playback & Performance

### Q: Does the sequencer keep playing when the display is off?

**Yes!** The sequencer continues to:

- ✅ Play all audio/MIDI correctly
- ✅ Advance the playhead
- ✅ Follow song mode patterns
- ✅ Maintain all track states

Only the visual display on the Stream Deck hardware is affected by screensaver settings.

---

## Multi-Track System

### Q: How do I switch between drum machine tracks?

Press the **Track** button to open the track select view. The 8 step buttons will show your available tracks (1-8). Press a button to switch to that track.

### Q: Are mute states per-track or global?

Mute states are **per-track**. Each drum machine track has its own independent mute settings for all 8 sounds.

---

## Song Mode

### Q: Why does song mode wait before starting?

When switching from pattern mode to song mode while playing, the sequencer waits until the next bar (step 1) to ensure smooth, rhythmically-aligned transitions.

---

## Safety Features

### Q: Why can't I stop playback by pressing the play/stop button?

**This is a safety feature!** When playing, you must hold **Shift** and then press the play/stop button to stop. This prevents accidental stops during performances.

When playing without Shift held, the button shows a spinning tape animation to indicate the sequencer is running.

---

## Troubleshooting

### Q: I don't hear any sound, what should I check?

1. Check the **Output Mode** in settings (Track button → Shift+Track → Settings):
   - **MIDI**: Sends notes to your DAW - make sure your DAW is receiving MIDI
   - **Sample**: Plays WAV files - make sure a drum kit is loaded

2. Check if tracks are muted (Shift+Sound to open mute view)

3. Check if the drum machine track is muted (in track select view)

4. Verify a drum kit is loaded (Shift+N to open kit select)

### Q: My patterns aren't saving, why?

The sequencer auto-saves when you:

- Stop playback
- Switch patterns
- Exit the application

Make sure you're not force-quitting the Stream Deck application.

---

## Tips & Tricks

### Keyboard Shortcuts

- **Shift + Button**: Access secondary functions
- **Shift + Play/Stop**: Safe stop (prevents accidental stops)
- **Shift + Pattern**: Toggle between Pattern and Song mode
- **Shift + Track**: Access MIDI settings
- **Shift + Sound**: Open mute view
- **Shift + N**: Open drum kit selector

### Performance Tips

1. Set up your song chain before performing (Song Edit View)
2. Use the safe stop feature (Shift+Stop) to prevent accidents
3. Adjust your OS screensaver settings for long performances
4. Use multiple tracks to layer different drum kits

---

_For more information, see FEATURES.md_
