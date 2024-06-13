import { SpriteRenderer } from "./SpriteRenderer";
import { Rect2D } from "./Rect2D";
import { Vect2D } from "./Vect2D";
import PowerElement from "./PowerElement";
import Player from "./Player";
import { AABBIntersect } from "../utils";
class Obstacle {
  rect: Rect2D;
  spriteRenderer: SpriteRenderer;
  addOn: PowerElement | null = null;
  moving: boolean = false;
  breakable: boolean = false;
  broken: boolean = false;
  moveSpeed: number = 5;
  player: Player | null = null;
  // moveDirn: number = 1;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    sourceImgElement: HTMLImageElement
  ) {
    this.rect = new Rect2D(x, y, width, height, "red", true);
    this.spriteRenderer = new SpriteRenderer(
      this.rect,
      sourceImgElement,
      false,
      1,
      [new Vect2D(0, 0)]
    );
  }

  setAddOn(addOn: PowerElement) {
    this.addOn = addOn;
  }

  makeMoving(speed: number = 5) {
    this.moving = true;
    this.moveSpeed = speed;
    this.spriteRenderer.setStaticSourceOffset(new Vect2D(0, 35));
  }
  makeBreakable(player: Player) {
    this.breakable = true;
    this.player = player;
    // this.broken= true;
    this.spriteRenderer.setStaticSourceOffset(new Vect2D(0, 105));
  }

  reset() {
    this.rect.width = 124;
    this.rect.height = 35;
    this.broken = false;
    this.breakable= false;
    this.moving = false;
    this.spriteRenderer.setStaticSourceOffset(new Vect2D(0, 0));
  }
  render(ctx: CanvasRenderingContext2D) {
    this.spriteRenderer.render(ctx);
    if (this.addOn) this.addOn.spriteRenderer.render(ctx);
  }

  update(ctx: CanvasRenderingContext2D) {
    if (this.moving) {
      this.rect.x += this.moveSpeed;
      if (this.rect.x + this.rect.width > ctx.canvas.width || this.rect.x < 0)
        this.moveSpeed *= -1;
    }
    // console.log(this.breakable)
  //  this.rect.height = 0
  }
}
export default Obstacle;
