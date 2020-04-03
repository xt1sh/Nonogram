import { Coordinates } from './coordinates';
import { CellStates } from 'src/enums/cell-states.enum';
import * as p5 from 'p5';
import { Globals } from 'src/utils/globals';
import { Field } from './field';
import { CellClickStates } from 'src/enums/cell-click-states.enum';

export class Cell {

  public state: CellStates;
  public prevState: CellStates;
  public coordinates: Coordinates;

  private field: Field;

  constructor(field: Field) {
    this.state = CellStates.empty;
    this.field = field;
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

  public onClick(p: p5) {
    if (p.mouseButton === p.LEFT) {
      if (this.state === CellStates.true) {
        this.changeState(CellStates.empty);
      } else {
        this.changeState(CellStates.true);
      }
    } else if (p.mouseButton === p.RIGHT) {
      if (this.state === CellStates.false) {
        this.changeState(CellStates.empty);
      } else  {
        this.changeState(CellStates.false);
      }
    }
    if (this.prevState === CellStates.empty) {
      if (this.state === CellStates.true) {
        this.field.cellClickState = CellClickStates.emptyTrue;
      } else {
        this.field.cellClickState = CellClickStates.emptyFalse;
      }
    } else if (this.prevState === CellStates.true) {
      if (this.state === CellStates.empty) {
        this.field.cellClickState = CellClickStates.trueEmpty;
      } else {
        this.field.cellClickState = CellClickStates.trueFalse;
      }
    } else if (this.prevState === CellStates.false) {
      if (this.state === CellStates.empty) {
        this.field.cellClickState = CellClickStates.falseEmpty;
      } else {
        this.field.cellClickState = CellClickStates.falseTrue;
      }
    }
  }

  public onLKMDown() {
    if (this.state === CellStates.true && this.field.cellClickState === CellClickStates.trueEmpty) {
      this.changeState(CellStates.empty);
    } else if ((this.field.cellClickState === CellClickStates.falseTrue || this.field.cellClickState === CellClickStates.emptyTrue)
            && (this.field.cellClickState !== CellClickStates.emptyTrue || this.state !== CellStates.false)) {
      this.changeState(CellStates.true);
    }
  }

  public onRKMDown() {
    if (this.state === CellStates.false && this.field.cellClickState === CellClickStates.falseEmpty) {
      this.changeState(CellStates.empty);
    } else if ((this.field.cellClickState === CellClickStates.trueFalse || this.field.cellClickState === CellClickStates.emptyFalse)
            && (this.field.cellClickState !== CellClickStates.emptyFalse || this.state !== CellStates.true)) {
      this.changeState(CellStates.false);
    }
  }

  private changeState(state: CellStates) {
    if ((this.state === CellStates.empty || this.state === CellStates.false) && state === CellStates.true) {
      this.field.fullCellsAmount++;
    } else if (this.state === CellStates.true && (state === CellStates.empty || state === CellStates.false)) {
      this.field.fullCellsAmount--;
    }
    this.prevState = this.state;
    this.state = state;
  }

  private drawBase(p: p5) {
    p.stroke(100);
    p.strokeWeight(2);
    p.square(this.coordinates.x, this.coordinates.y, Globals.cellSize);
  }

  private drawFull(p: p5) {
    p.fill(0);
    this.drawBase(p);
  }

  private drawCrossed(p: p5) {
    p.fill(255);
    this.drawBase(p);
    p.fill(0);
    p.stroke(0);
    let x1: number = this.coordinates.x + 3;
    let y1: number = this.coordinates.y + 3;
    let x2: number = this.coordinates.x + Globals.cellSize - 3;
    let y2: number = this.coordinates.y + Globals.cellSize - 3;
    p.line(x1, y1, x2, y2);
    p.line(x1, y2, x2, y1);
  }
}
