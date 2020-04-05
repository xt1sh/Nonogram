import { Cell } from "./cell";
import * as p5 from "p5";
import { Globals } from "src/utils/globals";
import { Coordinates } from "./coordinates";
import { Solution } from './solution';
import { CellStates } from 'src/enums/cell-states.enum';
import { compact } from 'lodash';
import { Utilities } from 'src/utils/utilities';
import { CellClickStates } from 'src/enums/cell-click-states.enum';

export class Field {
  public width: number;
  public height: number;
  public cells: Cell[][];
  public offset: Coordinates;
  public fullCellsAmount: number;
  public cellClickState: CellClickStates;
  public conditionCellsAmount: Coordinates;

  private fieldSize: Coordinates;
  private solution: Solution;
  private solutionCellsAmount: number;

  constructor(fieldSize: Coordinates) {
    this.fullCellsAmount = 0;
    this.fieldSize = fieldSize;
  }

  draw(p: p5) {
    this.drawConditionCells(p);
    for (let row of this.cells) {
      for (let cell of row) {
        cell.draw(p);
      }
    }
    this.drawHelpLines(p);
  }

  onMousePressed(p: p5) {
    let cellCoordinates = this.getCellIndex(p.mouseX, p.mouseY);
    this.cells[cellCoordinates.y][cellCoordinates.x].onClick(p);
    if (this.isSolved()) {
      this.win();
    }
  }

  onMouseMove(p: p5) {
    let cellCoordinates = this.getCellIndex(p.mouseX, p.mouseY);
    if (p.mouseButton === p.LEFT) {
      this.cells[cellCoordinates.y][cellCoordinates.x].onLKMDown();
    } else if (p.mouseButton === p.RIGHT) {
      this.cells[cellCoordinates.y][cellCoordinates.x].onRKMDown();
    }
    if (this.isSolved()) {
      this.win();
    }
  }

  setSolution(solution: Solution) {
    this.solution = solution;
    this.solutionCellsAmount = this.getSolutionCellsAmount();
    let cellSize = Globals.cellSize;
    this.cells = [];
    let maxRowLength = 0;
    let maxColLength = 0;
    solution.rowClues.forEach(row => {
      if (row.length > maxColLength) maxColLength = row.length;
    });
    solution.colClues.forEach(col => {
      if (col.length > maxRowLength) maxRowLength = col.length;
    })
    this.conditionCellsAmount = new Coordinates(maxRowLength, maxColLength);
    this.offset = new Coordinates(Globals.cellSize * maxRowLength, Globals.cellSize * maxColLength)
    let x = this.offset.x;
    let y = this.offset.y;
    for (let i = 0; i < this.fieldSize.y; i++) {
      this.cells[i] = [];
      for (let j = 0; j < this.fieldSize.x; j++) {
        this.cells[i][j] = new Cell(this);
        this.cells[i][j].coordinates = new Coordinates(x, y);
        x += cellSize;
      }
      y += cellSize;
      x = this.offset.x;
    }
  }

  private drawConditionCells(p: p5) {
    let cellSize = Globals.cellSize;
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.strokeWeight(1);
    for (let i = 0; i < this.fieldSize.y; i++) {
      let counter = 0;
      for (let j = this.conditionCellsAmount.x - 1; j >= 0; j--) {
        let x = j * cellSize;
        let y = this.offset.y + i * cellSize;
        p.fill(155);
        p.stroke(100);
        p.square(x, y, cellSize);
        p.fill(0);
        p.noStroke();
        let solution = this.solution.colClues[i][this.solution.colClues[i].length - counter - 1] || '';
        p.text(solution, x , y, cellSize, cellSize);
        counter++;
      }
    }
    for (let i = 0; i < this.fieldSize.x; i++) {
      let counter = 0;
      for (let j = this.conditionCellsAmount.y - 1; j >= 0; j--) {
        let x = this.offset.x + i * cellSize;
        let y = j * cellSize;
        p.fill(155);
        p.stroke(100);
        p.square(x, y, cellSize);
        let solution = this.solution.rowClues[i][this.solution.rowClues[i].length - counter - 1] || '';
        p.fill(0);
        p.noStroke();
        p.text(solution, x, y, cellSize, cellSize);
        counter++;
      }
    }
  }

  private drawHelpLines(p: p5) {
    p.stroke(180);
    p.strokeWeight(3);
    for (let i = 5; i < this.fieldSize.y; i += 5) {
      let y = this.offset.y + i * Globals.cellSize;
      p.line(0, y, Globals.canvasSize.x, y);
    }
    for (let i = 5; i < this.fieldSize.x; i += 5) {
      let x = this.offset.x + i * Globals.cellSize;
      p.line(x, 0, x, Globals.canvasSize.y);
    }
  }

  private getCellIndex(offsetX: number, offsetY: number): Coordinates {
    let x = Math.floor((offsetX - this.offset.x) / Globals.cellSize);
    let y = Math.floor((offsetY - this.offset.y) / Globals.cellSize);
    return new Coordinates(x, y);
  }

  private getSolutionCellsAmount(): number {
    let sum = 0;
    this.solution.colClues.forEach((row) => {
      row.forEach(element => {
        sum += element;
      })
    });
    return sum;
  }

  private getFullCellsAmount(): number {
    let sum = 0;
    this.cells.forEach(row => {
      row.forEach(cell => {
        if (cell.state === CellStates.true) {
          sum++;
        }
      })
    })
    return sum;
  }

  private isSolved(): boolean {
    if (this.fullCellsAmount != this.solutionCellsAmount) {
      return false;
    }
    let rowMask: number[] = [];
    let counter = 0;
    let lastCount = 0;
    for (let i = 0; i < this.fieldSize.y; i++) {
      for (let j = 0; j < this.fieldSize.x; j++) {
        lastCount = counter;
        if (this.cells[i][j].state === CellStates.true) {
          counter++;
        } else {
          counter = 0;
        }
        if (counter === 0) {
          rowMask.push(lastCount);
        }
      }
      rowMask.push(counter);
      if (!Utilities.areArraysEqual(this.solution.colClues[i], compact(rowMask))) {
        return false;
      }
      counter = lastCount = 0;
      rowMask = [];
    }
    for (let i = 0; i < this.fieldSize.x; i++) {
      for (let j = 0; j < this.fieldSize.y; j++) {
        lastCount = counter;
        if (this.cells[j][i].state === CellStates.true) {
          counter++;
        } else {
          counter = 0;
        }
        if (counter === 0) {
          rowMask.push(lastCount);
        }
      }
      rowMask.push(counter);
      if (!Utilities.areArraysEqual(this.solution.rowClues[i], compact(rowMask))) {
        return false;
      }
      counter = lastCount = 0;
      rowMask = [];
    }
    return true;
  }

  private win() {
    alert('gj');
  }
}
