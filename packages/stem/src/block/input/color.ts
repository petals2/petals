export type SerializedColorInput = [9, `#${string}`];

export class ColorInput {
  constructor(protected red: number, protected green: number, protected blue: number) { }

  serialize(): SerializedColorInput { return [9, this.getHex()] }

  getValue(): [number, number, number] { return [this.red, this.green, this.blue] }
  getHex(): `#${string}` { return `#${this.red.toString(16).padStart(2, "0")}${this.green.toString(16).padStart(2, "0")}${this.blue.toString(16).padStart(2, "0")}` }
}
