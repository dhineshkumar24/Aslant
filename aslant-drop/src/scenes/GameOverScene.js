import Phaser from 'phaser';
import { CONFIG } from '../config.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { WIDTH, HEIGHT } = CONFIG;
    this.cameras.main.setBackgroundColor(CONFIG.PALETTE.bg);
    this.cameras.main.fadeIn(400, 0, 0, 0);

    if (!this.registry.get('best') || this.finalScore > this.registry.get('best')) {
      this.registry.set('best', this.finalScore);
    }
    const best = this.registry.get('best');

    this.add
      .text(WIDTH / 2, HEIGHT * 0.36, 'lost to the dark', {
        fontFamily: 'Georgia, serif',
        fontSize: '30px',
        color: '#6a6a82',
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, HEIGHT * 0.47, this.finalScore.toString(), {
        fontFamily: 'Georgia, serif',
        fontSize: '72px',
        color: '#ff9d3c',
      })
      .setOrigin(0.5);

    this.add
      .text(WIDTH / 2, HEIGHT * 0.55, `best  ${best}`, {
        fontFamily: '-apple-system, sans-serif',
        fontSize: '18px',
        color: '#8a8aa0',
      })
      .setOrigin(0.5);

    const again = this.add
      .text(WIDTH / 2, HEIGHT * 0.68, 'tap to descend again', {
        fontFamily: '-apple-system, sans-serif',
        fontSize: '18px',
        color: '#d8d6e0',
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: again,
      alpha: 0.4,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });

    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Play'));
    });
  }
}
