const BEST_SCORE_KEY = 'aslant-drop-best';

export function loadBestScore() {
  try {
    const value = localStorage.getItem(BEST_SCORE_KEY);
    if (value === null) return 0;
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

export function updateBestScore(score) {
  const best = loadBestScore();
  if (score > best) {
    saveBestScore(score);
    return score;
  }
  return best;
}
