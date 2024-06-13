import { Rect2D } from "./Rect2D";

export class RigidBody {
  rect: Rect2D;
  vx: number = 0;
  vy: number = 0;
  ax: number = 0;
  ay: number = 0;
  dragX: number = 0;
  dragY: number = 0;
  gravity: number = 0;
  constructor(
    rect: Rect2D,
    vx: number = 0,
    vy: number = 0,
    ax: number = 0,
    ay: number = 0,
    dragX: number = 0,
    dragY: number = 0
  ) {
    this.rect = rect;
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
    this.dragX = dragX;
    this.dragY = dragY;
  }

  update(delta: number) {
    this.vx *= 1 - this.dragX;
    this.vy *= 1 - this.dragY;
    this.vx += this.ax * delta;
    this.vy += this.ay * delta;
    this.vy += this.gravity * delta;
    this.rect.x += this.vx * delta;
    this.rect.y += this.vy * delta;
  }
}

export default RigidBody;
