import { Component, OnInit } from "@angular/core";
import * as p5 from "p5";
import { Field } from "src/models/field";
import { Globals } from "src/utils/globals";
import { Coordinates } from "src/models/coordinates";
import { Solution } from "src/models/solution";
import puzzles from "../../assets/puzzles.json";
import { compact } from "lodash";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  p5: p5;
  field: Field;
  solutions: Solution[];

  constructor() {}

  ngOnInit() {
    document.oncontextmenu = () => false;
    this.solutions = this.getPuzzles();
    let solution = this.solutions[Math.round(Math.random() * this.solutions.length)];
    let fieldSize: Coordinates = new Coordinates(
      solution.sizeRow,
      solution.sizeCol
    );
    this.field = new Field(fieldSize);
    this.field.setSolution(solution);
    Globals.canvasSize = fieldSize
      .multiply(new Coordinates(Globals.cellSize, Globals.cellSize))
      .add(this.field.offset);
    this.createCanvas();
  }

  getPuzzles() {
    let solutions: Solution[] = [];
    (puzzles as any[]).forEach((el) => {
      el.colClues = this.parseClues(el.colClues, el.sizeCol);
      el.rowClues = this.parseClues(el.rowClues, el.sizeRow);
      solutions.push(el);
    });
    return solutions;
  }

  parseClues(clues: string, size: number): number[][] {
    let intArr = [];
    let counter = -1;
    let splittedClues = clues.split(",");
    let maxLength = Math.ceil(splittedClues.length / size);
    splittedClues.forEach((val, index) => {
      if (index % maxLength === 0) {
        intArr[++counter] = [];
      }
      let number = parseInt(val);
      if (number) {
        intArr[counter].push(number);
      }
    });
    return intArr as number[][];
  }

  listToMatrix(list: any[], elementsPerSubArray: number): any[][] {
    let matrix = [],
      i: number,
      k: number;
    for (i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
        k++;
        matrix[k] = [];
      }
      matrix[k].push(list[i]);
    }
    return matrix;
  }

  createCanvas() {
    this.p5 = new p5((p) => this.sketch(p, this));
  }

  isMouseOnField(offsetX: number, offsetY: number): boolean {
    return (
      offsetX > this.field.offset.x &&
      offsetX < Globals.canvasSize.x &&
      offsetY > this.field.offset.y &&
      offsetY < Globals.canvasSize.y
    );
  }

  sketch(p: p5, self: this) {
    p.setup = () => {
      p.createCanvas(Globals.canvasSize.x, Globals.canvasSize.y);
      p.background(200);
    };

    p.draw = () => {
      p.fill(255);
      self.field.draw(p);
    };

    p.mousePressed = (e) => {
      if (!self.isMouseOnField(p.mouseX, p.mouseY)) {
        return;
      }
      self.field.onMousePressed(p);
    };

    p.mouseDragged = (e) => {
      if (!self.isMouseOnField(p.mouseX, p.mouseY)) {
        return;
      }
      self.field.onMouseMove(p);
    };
  }
}
