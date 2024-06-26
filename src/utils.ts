import Rect2D from './classes/Rect2D';
interface IKeymap {
  left: string;
  right: string;
  fire: string;
}
interface Button {
  text: string;
  rect: Rect2D;
  onClick: () => void;
  active: boolean;
}


export function AABBIntersect(rect1: Rect2D, rect2: Rect2D) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}
export type  { IKeymap, Button };