import { Cell } from "./cell";
import * as p5 from "p5";
import { Globals } from "src/app/globals";
import { Size } from "./size";

export class Field {
  public width: number;
  public height: number;
  public cells: Cell[][];
  private fieldSize: Size;

  constructor(fieldSize: Size) {
    this.cells = [];
    for (let i = 0; i < fieldSize.width; i++) {
      this.cells[i] = [];
      for (let j = 0; j < fieldSize.height; j++) {
        this.cells[i][j] = new Cell();
      }
    }
    this.fieldSize = fieldSize;
  }

  draw(p: p5) {
    let x: number = 0;
    let y: number = 0;
    let cellSize: Size = Cell.calculateCellSize(Globals.canvasSize, {
      width: this.fieldSize.width,
      height: this.fieldSize.height
    });
    for (let i = 0; i < this.fieldSize.width; i++) {
      for (let j = 0; j < this.fieldSize.height; j++) {
        p.rect(x, y, cellSize.width, cellSize.height);
        x += cellSize.width;
      }
      y += cellSize.height;
      x = 0;
    }
  }
}
