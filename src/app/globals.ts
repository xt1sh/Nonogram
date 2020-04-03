import { Coordinates } from 'src/models/coordinates';

export class Globals {
  public static canvasSize: Coordinates = new Coordinates({ x: 500, y: 500 });
  public static cellSize: number = 25;
}
