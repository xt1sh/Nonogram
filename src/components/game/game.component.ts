import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { Field } from 'src/models/field';
import { Globals } from 'src/utils/globals';
import { Coordinates } from 'src/models/coordinates';
import { Solution } from 'src/models/solution';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  p5: p5;
  field: Field;

  constructor() { }

  ngOnInit() {
    document.oncontextmenu = () => false;

    let fieldSize: Coordinates = new Coordinates(3, 2);
    this.field = new Field(fieldSize);
    this.field.setSolution(new Solution([[1, 1], [1]], [[2], [], [1]]));
    Globals.canvasSize = fieldSize
      .multiply(new Coordinates(Globals.cellSize, Globals.cellSize))
      .add(this.field.offset);
    this.createCanvas();
  }

  createCanvas() {
    this.p5 = new p5((p) => this.sketch(p, this));
  }

  isMouseOnField(offsetX: number, offsetY: number): boolean {
    return (offsetX > this.field.offset.x && offsetX < Globals.canvasSize.x)
        && (offsetY > this.field.offset.y && offsetY < Globals.canvasSize.y);
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
