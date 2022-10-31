export type SerializedColorInput = [9, `#${string}`];

export class ColorInput {
  protected readonly red: number;
  protected readonly green: number;
  protected readonly blue: number;

  constructor(hex: string)
  constructor(red: number, green: number, blue: number)
  constructor(arg0: number | string, arg1?: number, arg2?: number) {
    if (typeof arg0 !== "string") {
      this.red = arg0;
      this.green = arg1!;
      this.blue = arg2!;
      return this;
    }

    const hex = arg0.substring(1);
    this.red = parseInt(hex.substring(0, 2), 16);
    this.green = parseInt(hex.substring(2, 4), 16);
    this.blue = parseInt(hex.substring(4, 6), 16);
  }

  serialize(): SerializedColorInput { return [9, this.getHex()] }

  getValue(): [number, number, number] { return [this.red, this.green, this.blue] }
  getHex(): `#${string}` { return `#${this.red.toString(16).padStart(2, "0")}${this.green.toString(16).padStart(2, "0")}${this.blue.toString(16).padStart(2, "0")}` }
}
