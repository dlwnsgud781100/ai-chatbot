# Aurel's Heartroot Sanctum

`DungeonService` implements the bounded `aurel_sanctum` state machine:

`NotStarted → Entered → EliteDefeated → BossDefeated → Completed`

## Entry validation

The Skywell Gate calls `DungeonService.enter`; it validates the configured minimum level (2), the `aurel_sanctum` world unlock, and an active/ready Sanctum quest. Failed admission leaves the player and dungeon state unchanged and explains the missing requirement.

On entry, the player moves to the authored encounter position and `SpawnManager` refreshes. The Root Warden spawn is unavailable until entry; Aurel's boss spawn remains unavailable until the exact gated elite is defeated. The quest objectives also carry source-spawn IDs, preventing unrelated Root Wardens or bosses from satisfying the Sanctum chain.

On Aurel's defeat, the service emits `dungeon:completed`; `RewardService` applies its configured completion reward. Dungeon state is saved under the player progression snapshot and restored before streaming activates.

This is a single authored encounter gate, not a procedural instance generator or a generalized future dungeon framework.
