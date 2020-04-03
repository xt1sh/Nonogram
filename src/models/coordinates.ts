export class Coordinates {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  multiply(size: Coordinates) {
    return new Coordinates(this.x * size.x, this.y * size.y)
  }

  add(size: Coordinates) {
    return new Coordinates(this.x + size.x, this.y + size.y)
  }
}
