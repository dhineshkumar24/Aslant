import Phaser from 'phaser';
import { CONFIG } from '../config.js';
import { getGameSafeAreaInsets, lerpFactor } from '../safeArea.js';

export class PlayScene extends Phaser.Scene {
  constructor() {
    super('Play');
  }

  create() {
    const { WIDTH, HEIGHT, PALETTE } = CONFIG;
    this.cameras.main.setBackgroundColor(PALETTE.bg);
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.isAlive = true;
    this.score = 0;
    this.displayScore = 0;
    this.difficultyTier = 0;
    this.spawnDelay = CONFIG.SPAWN_START_MS;
    this.distractions = [];

    this.spawnAtmosphere();
    this.addVignette();

    this.safeArea = getGameSafeAreaInsets(this);

    this.player = this.add.container(WIDTH / 2, HEIGHT / 2);
    const glow = this.add.circle(0, 0, 26, PALETTE.playerGlow, 0.18);
    const glow2 = this.add.circle(0, 0, 16, PALETTE.playerGlow, 0.28);
    const core = this.add.circle(0, 0, 9, PALETTE.player, 1);
    this.player.add([glow, glow2, core]);
    this.player.setDepth(10);
    this.physics.world.enable(this.player);
    this.player.body.setCircle(9, -9, -9);

    this.tweens.add({
      targets: [glow, glow2],
      scale: 1.25,
      alpha: '+=0.06',
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.inOut',
    });

    this.targetX = this.player.x;
    this.targetY = this.player.y;
    this.pointerDown = false;

    this.input.on('pointerdown', (p) => {
      this.pointerDown = true;
      this.targetX = p.x;
      this.targetY = p.y;
    });
    this.input.on('pointermove', (p) => {
      if (this.pointerDown || p.isDown) {
        this.targetX = p.x;
        this.targetY = p.y;
      }
    });
    this.input.on('pointerup', () => {
      this.pointerDown = false;
    });

    this.hazards = this.physics.add.group();
    this.physics.add.overlap(this.player, this.hazards, this.hitHazard, null, this);

    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay,
      callback: this.spawnHazard,
      callbackScope: this,
      loop: true,
    });

    this.ghostTimer = this.time.addEvent({
      delay: CONFIG.GHOST_SHARD_INTERVAL_MS,
      callback: this.spawnGhostShard,
      callbackScope: this,
      loop: true,
    });

    this.scoreText = this.add
      .text(WIDTH / 2, 60 + this.safeArea.top, '0', {
        fontFamily: 'Georgia, serif',
        fontSize: '40px',
        color: PALETTE.text,
      })
      .setOrigin(0.5)
      .setAlpha(0.85)
      .setDepth(20);

    this.scoreTimer = this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (!this.isAlive) return;
        this.score += 1;
        const points = Math.floor(this.score / 10);
        this.scoreText.setText(points.toString());
        if (points !== this.displayScore) {
          this.displayScore = points;
          this.applyDifficulty(points);
        }
      },
    });
  }

  getDifficultyTier(points) {
    return Math.floor(points / CONFIG.DIFFICULTY_SCORE_STEP);
  }

  applyDifficulty(points) {
    const tier = this.getDifficultyTier(points);
    this.difficultyTier = tier;

    const spawnDelay = Math.max(
      CONFIG.SPAWN_MIN_MS,
      CONFIG.SPAWN_START_MS - tier * 55,
    );
    if (spawnDelay !== this.spawnDelay) {
      this.spawnDelay = spawnDelay;
      this.spawnTimer.reset({
        delay: spawnDelay,
        callback: this.spawnHazard,
        callbackScope: this,
        loop: true,
      });
    }

    const ghostDelay = Math.max(
      CONFIG.GHOST_INTERVAL_MIN_MS,
      CONFIG.GHOST_SHARD_INTERVAL_MS - tier * 45,
    );
    this.ghostTimer.reset({
      delay: ghostDelay,
      callback: this.spawnGhostShard,
      callbackScope: this,
      loop: true,
    });
  }

  getHazardSpeedRange() {
    const tier = this.difficultyTier;
    return {
      min: CONFIG.HAZARD_MIN_SPEED + tier * 14,
      max: Math.min(
        CONFIG.HAZARD_MAX_SPEED_CAP,
        CONFIG.HAZARD_MAX_SPEED + tier * 22,
      ),
    };
  }

  getExtraHazardChance() {
    return Math.min(0.5, this.difficultyTier * 0.07);
  }

  spawnAtmosphere() {
    const { WIDTH, HEIGHT, PALETTE } = CONFIG;

    for (let i = 0; i < CONFIG.AMBIENT_SPECK_COUNT; i++) {
      const x = Phaser.Math.Between(0, WIDTH);
      const y = Phaser.Math.Between(0, HEIGHT);
      const dot = this.add.circle(
        x,
        y,
        Phaser.Math.Between(1, 3),
        PALETTE.hazardEdge,
        Phaser.Math.FloatBetween(0.15, 0.45),
      );
      dot.setDepth(1);
      this.distractions.push(dot);
      this.tweens.add({
        targets: dot,
        x: x + Phaser.Math.Between(-30, 30),
        y: y - Phaser.Math.Between(60, 180),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 11000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 5000),
        ease: 'Sine.inOut',
      });
    }

    for (let i = 0; i < CONFIG.FOG_WISP_COUNT; i++) {
      const wisp = this.add.ellipse(
        Phaser.Math.Between(0, WIDTH),
        Phaser.Math.Between(0, HEIGHT),
        Phaser.Math.Between(40, 100),
        Phaser.Math.Between(20, 50),
        PALETTE.fog,
        Phaser.Math.FloatBetween(0.04, 0.12),
      );
      wisp.setDepth(0);
      this.distractions.push(wisp);
      this.tweens.add({
        targets: wisp,
        x: `+=${Phaser.Math.Between(-80, 80)}`,
        y: `+=${Phaser.Math.Between(-40, 40)}`,
        alpha: { from: wisp.alpha, to: wisp.alpha * 0.3 },
        duration: Phaser.Math.Between(6000, 14000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
      });
    }
  }

  addVignette() {
    const { WIDTH, HEIGHT } = CONFIG;
    const edge = 90;
    const vignette = this.add.graphics().setDepth(15);
    vignette.fillStyle(0x000000, 0.35);
    vignette.fillRect(0, 0, WIDTH, edge);
    vignette.fillRect(0, HEIGHT - edge, WIDTH, edge);
    vignette.fillRect(0, 0, edge, HEIGHT);
    vignette.fillRect(WIDTH - edge, 0, edge, HEIGHT);
    this.distractions.push(vignette);
  }

  spawnGhostShard() {
    if (!this.isAlive) return;
    const { WIDTH, PALETTE } = CONFIG;
    const tier = this.difficultyTier;
    const x = Phaser.Math.Between(10, WIDTH - 10);
    const size = Phaser.Math.Between(8, 20 + Math.min(8, tier * 2));

    const ghost = this.add.rectangle(x, -20, size, size, PALETTE.hazard, 0.18);
    ghost.setStrokeStyle(1, PALETTE.hazardEdge, 0.25);
    ghost.setAngle(Phaser.Math.Between(0, 90));
    ghost.setDepth(2);
    this.distractions.push(ghost);

    const speed = Phaser.Math.Between(90 + tier * 8, 160 + tier * 15);
    this.tweens.add({
      targets: ghost,
      y: CONFIG.HEIGHT + 40,
      angle: ghost.angle + Phaser.Math.Between(-90, 90),
      duration: ((CONFIG.HEIGHT + 60) / speed) * 1000,
      ease: 'Linear',
      onComplete: () => {
        ghost.destroy();
        Phaser.Utils.Array.Remove(this.distractions, ghost);
      },
    });
  }

  spawnHazard() {
    if (!this.isAlive) return;
    this.spawnHazardShard();

    if (Phaser.Math.FloatBetween(0, 1) < this.getExtraHazardChance()) {
      this.time.delayedCall(Phaser.Math.Between(80, 220), () => {
        if (this.isAlive) this.spawnHazardShard();
      });
    }
  }

  spawnHazardShard() {
    if (!this.isAlive) return;
    const { WIDTH, PALETTE } = CONFIG;
    const tier = this.difficultyTier;
    const x = Phaser.Math.Between(20, WIDTH - 20);
    const size = Phaser.Math.Between(
      10 + Math.min(6, tier),
      26 + Math.min(8, tier * 2),
    );

    const shard = this.add.rectangle(x, -30, size, size, PALETTE.hazard);
    shard.setStrokeStyle(1, PALETTE.hazardEdge);
    shard.setAngle(Phaser.Math.Between(0, 90));
    shard.setDepth(5);
    this.hazards.add(shard);

    const { min, max } = this.getHazardSpeedRange();
    const speed = Phaser.Math.Between(min, max);
    shard.body.setVelocityY(speed);
    shard.body.setAngularVelocity(
      Phaser.Math.Between(-60 - tier * 5, 60 + tier * 5),
    );
    shard.body.setCollideWorldBounds(false);
  }

  update(_time, delta) {
    if (!this.isAlive) return;

    const margin = CONFIG.PLAYER_MARGIN;
    const { top, bottom, left, right } = this.safeArea;
    const t = lerpFactor(delta);
    const dx = this.targetX - this.player.x;
    const dy = this.targetY - this.player.y;
    this.player.x = Phaser.Math.Clamp(
      this.player.x + dx * t,
      margin + left,
      CONFIG.WIDTH - margin - right,
    );
    this.player.y = Phaser.Math.Clamp(
      this.player.y + dy * t,
      margin + top,
      CONFIG.HEIGHT - margin - bottom,
    );

    this.hazards.getChildren().forEach((h) => {
      if (h.y > CONFIG.HEIGHT + 40) h.destroy();
    });
  }

  hitHazard() {
    if (!this.isAlive) return;
    this.isAlive = false;

    this.cameras.main.flash(200, 255, 157, 60);
    this.cameras.main.shake(250, 0.012);
    this.spawnTimer.remove();
    this.ghostTimer.remove();
    this.scoreTimer.remove();

    this.tweens.add({ targets: this.player, alpha: 0, scale: 2, duration: 400 });

    this.time.delayedCall(700, () => {
      this.scene.start('GameOver', { score: Math.floor(this.score / 10) });
    });
  }
}
