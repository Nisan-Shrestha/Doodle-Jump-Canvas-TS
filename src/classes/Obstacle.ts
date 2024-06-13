import { SpriteRenderer } from "./SpriteRenderer";
import { Rect2D } from "./Rect2D";
import { Vect2D } from "./Vect2D";
import PowerElement from "./PowerElement";
class Obstacle {
  rect: Rect2D;
  spriteRenderer: SpriteRenderer;
  addOn: PowerElement | null = null;
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

  render(ctx: CanvasRenderingContext2D) {
    this.spriteRenderer.render(ctx);
    if (this.addOn) this.addOn.spriteRenderer.render(ctx);
  }
}

export default Obstacle;
