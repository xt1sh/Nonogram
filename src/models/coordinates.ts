export class Coordinates {
  x: number;
  y: number;

  constructor(size?: { x: number, y: number }) {
    this.x = size && size.x || 0;
    this.y = size && size.y || 0;
  }

  multiply(size: Coordinates) {
    return new Coordinates({ x: this.x * size.x, y: this.y * size.y })
  }
}
