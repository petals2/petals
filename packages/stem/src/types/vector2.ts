export class Vector2 {
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  constructor(
    protected readonly x: number,
    protected readonly y: number,
  ) {}

  getX(): number { return this.x }
  getY(): number { return this.y }
}
