export class Rect2D {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string = "purple";
  debugDraw: boolean = false;
  // image: Image
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = "purple",
    debugDraw: boolean = false
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.debugDraw = debugDraw;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    if (this.debugDraw) ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Rect2D