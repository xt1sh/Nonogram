import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { Field } from 'src/models/field';
import { Globals } from 'src/app/globals';
import { Coordinates } from 'src/models/coordinates';

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

    let fieldSize: Coordinates = new Coordinates({ x: 10, y: 15 });
    this.field = new Field(fieldSize);
    Globals.canvasSize = fieldSize.multiply(new Coordinates({ x: Globals.cellSize, y: Globals.cellSize }));
    this.createCanvas();
  }

  createCanvas() {
    this.p5 = new p5((p) => this.sketch(p, this));
  }

  isMouseOnCanvas(offsetX: number, offsetY: number): boolean {
    return (offsetX > 0 && offsetX < Globals.canvasSize.x)
        && (offsetY > 0 && offsetY < Globals.canvasSize.y);
  }

  sketch(p: p5, self: this) {
    p.setup = () => {
      p.createCanvas(Globals.canvasSize.x, Globals.canvasSize.y);
      p.background(55);
    };

    p.draw = () => {
      p.fill(255);
      self.field.draw(p);
    };

    p.mousePressed = (e) => {
      if (!self.isMouseOnCanvas(p.mouseX, p.mouseY)) {
        return;
      }
      self.field.onMousePressed(p);
    };

    p.mouseMoved = (e) => {

    };
  }
}
