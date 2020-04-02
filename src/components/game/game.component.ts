import { Component, OnInit } from '@angular/core';
import * as p5 from 'p5';
import { Field } from 'src/models/field';
import { Globals } from 'src/app/globals';

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
    this.field = new Field({ width: 10, height: 10});
    this.createCanvas();
  }

  createCanvas() {
    console.log(this.field)
    this.p5 = new p5((p) => this.sketch(p, this));
  }

  sketch(p: p5, self) {
    p.setup = () => {
      p.createCanvas(Globals.canvasSize.width, Globals.canvasSize.height);
      p.background(55);
    };

    p.draw = () => {
      p.fill(255);
      self.field.draw(p);
    };
  }

}
