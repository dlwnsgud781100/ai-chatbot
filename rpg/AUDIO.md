# Audio Architecture

`AudioService` is an event-driven, data-ID audio router. It exposes the channels:

`Master`, `Music`, `SFX`, `Combat`, `UI`, `Ambient`, and `Voice`.

`audio-manifest.js` maps cue IDs to their channel and a temporary synthesized envelope. Gameplay asks for IDs such as `player.swing.heavy`, `player.parry`, `combat.boss-phase`, `progress.level`, or `ui.click`; it does not create Web Audio nodes directly.

## Current playback

The project ships only synthesized Web Audio fallback cues for UI, footsteps, swings, impacts, dodge/parry, boss warning/phase, quest completion, item obtain, and level-up. These are intentionally identified as synthesized placeholders, not authored final sound assets. Browsers that do not expose an AudioContext fail silently.

## Music state seam

`Music State` supports `town`, `exploration`, `combat`, `elite`, `boss`, `boss_phase_2`, `boss_final`, `victory`, and `dungeon`. State changes and per-state crossfade metadata exist; no music asset is bundled, so transitions are currently silent rather than pretending music exists.

To add final audio, attach an asset URL/decoded buffer to the manifest record and retain the same ID/channel. The service owns gain routing and future crossfade behavior; combat and UI need not change.
