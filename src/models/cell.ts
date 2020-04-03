import { Coordinates } from './coordinates';
import { CellStates } from 'src/enums/cell-states.enum';
import * as p5 from 'p5';
import { Globals } from 'src/app/globals';

export class Cell {

  public state: CellStates;
  public coordinates: Coordinates;

  constructor() {
    this.state = CellStates.empty;
  }

  public draw(p: p5) {
    p.fill(255);
    if (this.state === CellStates.empty) {
      this.drawBase(p);
    } else if (this.state === CellStates.false) {
      this.drawCrossed(p);
    } else if (this.state === CellStates.true) {
      this.drawFull(p);
    }
  }

  public onLKMDown() {
    if (this.state === CellStates.true) {
      this.state = CellStates.empty;
    } else {
      this.state = CellStates.true;
    }
  }

  public onRKMDown() {
    if (this.state === CellStates.false) {
      this.state = CellStates.empty;
    } else {
      this.state = CellStates.false;
    }
  }

  private drawBase(p: p5) {
    p.rect(this.coordinates.x, this.coordinates.y, Globals.cellSize, Globals.cellSize);
  }

  private drawFull(p: p5) {
    p.fill(0);
    this.drawBase(p);
  }

  private drawCrossed(p: p5) {
    p.fill(255);
    this.drawBase(p);
    p.fill(0);
    let x1: number = this.coordinates.x + 3;
    let y1: number = this.coordinates.y + 3;
    let x2: number = this.coordinates.x + Globals.cellSize - 3;
    let y2: number = this.coordinates.y + Globals.cellSize - 3;
    p.line(x1, y1, x2, y2);
    p.line(x1, y2, x2, y1);
  }
}
