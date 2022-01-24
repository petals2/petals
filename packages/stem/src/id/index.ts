import bconvert from "bconvert";

export class ID {
  private static index: number = 0;

  static generate(): string {
    return bconvert.base64.convertTo(ID.index++);
  }
}
