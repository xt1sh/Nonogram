import { Size } from './size';
import { CellStates } from 'src/enums/cell-states.enum';

export class Cell {

  public state: CellStates;


  constructor() {
    this.state = CellStates.empty;
  }

  public static calculateCellSize(fieldSize: Size, amount: Size): Size {
    let size = new Size();
    size.width = fieldSize.width / amount.width;
    size.height = fieldSize.height / amount.height;
    return size;
  }

  onLKMDown() {
    if (this.state === CellStates.true) {
      this.state = CellStates.empty;
    } else {
      this.state = CellStates.true;
    }
  }

  onRKMDown() {
    if (this.state === CellStates.false) {
      this.state = CellStates.empty;
    } else {
      this.state = CellStates.false;
    }
  }
}
