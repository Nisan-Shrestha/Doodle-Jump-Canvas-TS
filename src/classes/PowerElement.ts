import { SpriteRenderer } from "./SpriteRenderer";
import { Rect2D } from "./Rect2D";
import { Vect2D } from "./Vect2D";
class PowerElement {
  rect: Rect2D;
  spriteRenderer: SpriteRenderer;
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
}

export default PowerElement;
