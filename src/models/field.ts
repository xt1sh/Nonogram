import { Cell } from "./cell";
import * as p5 from "p5";
import { Globals } from "src/utils/globals";
import { Coordinates } from "./coordinates";
import { Solution } from './solution';
import { CellStates } from 'src/enums/cell-states.enum';
import { compact } from 'lodash';
import { Utilities } from 'src/utils/utilities';

export class Field {
  public width: number;
  public height: number;
  public cells: Cell[][];
  public offset: Coordinates;

  private fieldSize: Coordinates;
  private solution: Solution;
  private solutionCellsAmount: number;

  constructor(fieldSize: Coordinates) {
    let cellSize = Globals.cellSize;
    this.cells = [];
    this.offset = new Coordinates(Globals.cellSize * Math.ceil(fieldSize.x / 2), Globals.cellSize * Math.ceil(fieldSize.y / 2))
    let x = this.offset.x;
    let y = this.offset.y;
    for (let i = 0; i < fieldSize.y; i++) {
      this.cells[i] = [];
      for (let j = 0; j < fieldSize.x; j++) {
        this.cells[i][j] = new Cell(this);
        this.cells[i][j].coordinates = new Coordinates(x, y);
        x += cellSize;
      }
      y += cellSize;
      x = this.offset.x;
    }
    this.fieldSize = fieldSize;
  }

  draw(p: p5) {
    this.drawConditionCells(p);
    for (let row of this.cells) {
      for (let cell of row) {
        cell.draw(p);
      }
    }
  }

  onMouseMove(e: MouseEvent) {

  }

  onMousePressed(p: p5) {
    let cellCoordinates = this.getCellIndex(p.mouseX, p.mouseY);
    if (p.mouseButton === p.LEFT) {
      this.cells[cellCoordinates.y][cellCoordinates.x].onLKMDown();
    } else if (p.mouseButton === p.RIGHT) {
      this.cells[cellCoordinates.y][cellCoordinates.x].onRKMDown();
    }
    if (this.isSolved()) {
      console.log('gj')
    }
  }

  setSolution(solution: Solution) {
    this.solution = solution;
    this.solutionCellsAmount = this.getSolutionCellsAmount();
  }

  private drawConditionCells(p: p5) {
    let cellSize = Globals.cellSize;
    let xAmount = Math.ceil(this.fieldSize.x / 2);
    let yAmount = Math.ceil(this.fieldSize.y / 2);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(18);
    for (let i = 0; i < this.fieldSize.y; i++) {
      p.fill(155);
      p.stroke(100);
      for (let j = 0; j < xAmount; j++) {
        p.square(j * cellSize, this.offset.y + i * cellSize, cellSize);
      }
      p.fill(0);
      p.noStroke();
      for (let j = xAmount - 1; j >= 0; j--) {
        let x = j * cellSize + 2;
        let y = this.offset.y + i * cellSize + 2;
        let solution = this.solution.xSolution[i][Math.ceil(j / 2)] || '';
        p.text(solution, x , y, cellSize, cellSize);
      }
    }
    for (let i = 0; i < this.fieldSize.x; i++) {
      p.fill(155);
      p.stroke(100);
      for (let j = 0; j < yAmount; j++) {
        p.square(this.offset.x + i * cellSize, j * cellSize, cellSize);
      }
      p.fill(0);
      p.noStroke();
      for (let j = yAmount - 1; j >= 0; j--) {
        let x = this.offset.x + i * cellSize + 2;
        let y = j * cellSize + 2;
        let solution = this.solution.ySolution[i][Math.ceil(j / 2)] || '';
        p.text(solution, x, y, cellSize, cellSize);
      }
    }
  }

  private getCellIndex(offsetX: number, offsetY: number): Coordinates {
    let x = Math.floor((offsetX - this.offset.x) / Globals.cellSize);
    let y = Math.floor((offsetY - this.offset.y) / Globals.cellSize);
    return new Coordinates(x, y);
  }

  private getSolutionCellsAmount(): number {
    let sum = 0;
    this.solution.xSolution.forEach((row) => {
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
    let fullCellsAmount = this.getFullCellsAmount();
    if (fullCellsAmount != this.solutionCellsAmount) {
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
      if (!Utilities.areArraysEqual(this.solution.xSolution[i], compact(rowMask))) {
        return false;
      }
      counter = lastCount = 0;
      rowMask = [];
    }
    return true;
  }
}
