import Phaser from 'phaser';
import { CONFIG } from '../config.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { WIDTH, HEIGHT, PALETTE } = CONFIG;
    this.cameras.main.setBackgroundColor(PALETTE.bg);

    this.spawnAmbient();

    const title = this.add
      .text(WIDTH / 2, HEIGHT * 0.38, 'ASLANT', {
        fontFamily: 'Georgia, serif',
        fontSize: '64px',
        color: '#ff9d3c',
        letterSpacing: 12,
      })
      .setOrigin(0.5);
    title.setAlpha(0);

    const sub = this.add
      .text(WIDTH / 2, HEIGHT * 0.46, 'drop', {
        fontFamily: 'Georgia, serif',
        fontSize: '22px',
        color: '#6a6a82',
        letterSpacing: 8,
      })
      .setOrigin(0.5);
    sub.setAlpha(0);

    const prompt = this.add
      .text(WIDTH / 2, HEIGHT * 0.62, 'tap and hold to move\navoid what falls', {
        fontFamily: '-apple-system, sans-serif',
        fontSize: '17px',
        color: '#8a8aa0',
        align: 'center',
        lineSpacing: 8,
      })
      .setOrigin(0.5);
    prompt.setAlpha(0);

    this.tweens.add({ targets: title, alpha: 1, duration: 1400, ease: 'Sine.out' });
    this.tweens.add({
      targets: sub,
      alpha: 1,
      duration: 1400,
      delay: 400,
      ease: 'Sine.out',
    });
    this.tweens.add({
      targets: prompt,
      alpha: 0.9,
      duration: 1200,
      delay: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });

    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Play'));
    });
  }

  spawnAmbient() {
    const { WIDTH, HEIGHT, PALETTE } = CONFIG;
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, WIDTH);
      const y = Phaser.Math.Between(0, HEIGHT);
      const dot = this.add.circle(
        x,
        y,
        Phaser.Math.Between(1, 2),
        PALETTE.hazardEdge,
        0.4,
      );
      this.tweens.add({
        targets: dot,
        y: y - Phaser.Math.Between(40, 120),
        alpha: 0,
        duration: Phaser.Math.Between(4000, 9000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 4000),
      });
    }
  }
}
