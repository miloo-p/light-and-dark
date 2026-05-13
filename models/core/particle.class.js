/**
 * Represents a single visual particle used for atmospheric or magical effects.
 * @class
 */
class Particle {
  /** @type {number} */
  x;

  /** @type {number} */
  y;

  /** @type {number} */
  size;

  /** @type {number} */
  life = 1.5;

  /** @type {number} */
  decay;

  /** @type {number} */
  vx;

  /** @type {number} */
  vy;

  /**
   * Initializes a new particle with randomized offsets, sizes, and velocities.
   * @param {number} startX - The base horizontal spawn coordinate.
   * @param {number} startY - The base vertical spawn coordinate.
   */
  constructor(startX, startY) {
    // Add a slight random spread around the exact spawn point
    this.x = startX + (Math.random() * 20 - 10);
    this.y = startY + (Math.random() * 10 - 5);

    // Initial size between 10 and 12
    this.size = Math.random() * 2 + 10;

    // Decay rate between 0.005 and 0.010 per frame
    this.decay = Math.random() * 0.005 + 0.005;

    // Slight random drift to the left or right
    this.vx = (Math.random() - 0.5) * 0.3;

    // Consistent upward float
    this.vy = Math.random() * -0.5 - 0.1;
  }

  /**
   * Updates the particle's physical state for the current frame.
   */
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.size += 0.05;
  }

  /**
   * Renders the particle onto the canvas.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   */
  draw(ctx) {
    ctx.save();

    // Prevent negative alpha values which cause canvas rendering errors
    ctx.globalAlpha = Math.max(0, this.life);

    // "lighter" mode adds overlapping colors together, creating a bright core where particles intersect
    ctx.globalCompositeOperation = "lighter";

    // Add a violet glowing halo around the particle
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(138, 43, 226, 0.5)";

    ctx.fillStyle = "rgba(84, 31, 133, 0.15)";

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
