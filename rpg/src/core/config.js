export const CONFIG = Object.freeze({
  build:'foundation-0.1.0',
  debug:new URLSearchParams(window.location.search).has('debug'),
  network:{ enabled:true, endpoint:'/api', timeoutMs:2800, sendIntentEveryMs:1200 },
  player:{ walkSpeed:6.1, sprintSpeed:9.4, jumpVelocity:8.2, gravity:23, maxSlopeHeight:1.8 },
  performance:{ maxDelta:.05, targetFps:60 },
  accessibility:{ reduceMotion:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false },
});
