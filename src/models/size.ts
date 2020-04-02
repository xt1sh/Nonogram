export class Size {
  width: number;
  height: number;

  constructor(size?: Size) {
    this.width = size && size.width || 0;
    this.height = size && size.height || 0;
   }
}
