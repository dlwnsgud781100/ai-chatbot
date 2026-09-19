# Camera

`CameraDirector` is a renderer-side third-person rig. It preserves gameplay-neutral camera controls while providing:

- exponentially smoothed follow and focus lag
- configurable distance and FOV
- right-mouse drag orbit with configurable sensitivity
- lock-on framing that includes player and target
- larger distance/FOV framing for a locked boss
- dodge/ultimate/boss impulse seam
- terrain floor clearance
- registered obstacle collision raycasts

The collision raycaster checks only explicit camera colliders (World Tree trunk, streamed tree trunks, and gate slabs), avoiding a full-world mesh raycast every frame. It pulls the camera forward if its desired line crosses a collider. This is a meaningful camera-collision implementation for the current procedural scene, not a substitute for collision volumes in a future authored world.

There is no cinematic rail camera, cutscene director, or animation root motion in this phase. The animation system exposes a root-motion integration seam for actual clips later; player movement remains Phase 3 controller-driven.
