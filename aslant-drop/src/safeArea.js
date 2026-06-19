import { CONFIG } from './config.js';

function measureCssSafeAreaInsets() {
  const probe = document.createElement('div');
  probe.style.position = 'fixed';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.paddingTop = 'env(safe-area-inset-top)';
  probe.style.paddingBottom = 'env(safe-area-inset-bottom)';
  probe.style.paddingLeft = 'env(safe-area-inset-left)';
  probe.style.paddingRight = 'env(safe-area-inset-right)';
  document.body.appendChild(probe);

  const style = getComputedStyle(probe);
  const insets = {
    top: parseFloat(style.paddingTop) || 0,
    bottom: parseFloat(style.paddingBottom) || 0,
    left: parseFloat(style.paddingLeft) || 0,
    right: parseFloat(style.paddingRight) || 0,
  };

  document.body.removeChild(probe);
  return insets;
}

/** Convert CSS safe-area pixels to Phaser game coordinates. */
export function getGameSafeAreaInsets(scene) {
  const css = measureCssSafeAreaInsets();
  const displayHeight = scene.scale.displaySize.height || 1;
  const displayWidth = scene.scale.displaySize.width || 1;

  return {
    top: (css.top / displayHeight) * CONFIG.HEIGHT,
    bottom: (css.bottom / displayHeight) * CONFIG.HEIGHT,
    left: (css.left / displayWidth) * CONFIG.WIDTH,
    right: (css.right / displayWidth) * CONFIG.WIDTH,
  };
}

/** Frame-rate independent lerp factor matching ~0.18 per frame at 60fps. */
export function lerpFactor(delta, rate = CONFIG.PLAYER_LERP) {
  const step = delta / (1000 / 60);
  return 1 - (1 - rate) ** step;
}
