import { Cell } from "./cell";
import * as p5 from "p5";
import { Globals } from "src/app/globals";
import { Coordinates } from "./coordinates";

export class Field {
  public width: number;
  public height: number;
  public cells: Cell[][];
  private fieldSize: Coordinates;

  constructor(fieldSize: Coordinates) {
    let cellSize: number = Globals.cellSize;
    let x: number = 0;
    let y: number = 0;
    this.cells = [];
    console.log(fieldSize)
    for (let i = 0; i < fieldSize.y; i++) {
      this.cells[i] = [];
      for (let j = 0; j < fieldSize.x; j++) {
        this.cells[i][j] = new Cell();
        this.cells[i][j].coordinates = new Coordinates({ x: x, y: y});
        x += cellSize;
      }
      y += cellSize;
      x = 0;
    }
    this.fieldSize = fieldSize;
  }

  draw(p: p5) {
    for (let row of this.cells) {
      for (let cell of row) {
        cell.draw(p);
      }
    }
  }

  onMouseMove(e: MouseEvent) {

  }

  onMousePressed(p: p5) {
    let cellCoordinates = this.calculateCellIndex(p.mouseX, p.mouseY);
    if (p.mouseButton === p.LEFT) {
      this.cells[cellCoordinates.y][cellCoordinates.x].onLKMDown();
    } else if (p.mouseButton === p.RIGHT) {
      this.cells[cellCoordinates.y][cellCoordinates.x].onRKMDown();
    }
  }

  private calculateCellIndex(offsetX: number, offsetY: number): Coordinates {
    let x = Math.floor(offsetX / Globals.cellSize);
    let y = Math.floor(offsetY / Globals.cellSize);
    return new Coordinates({ x: x, y: y });
  }
}
