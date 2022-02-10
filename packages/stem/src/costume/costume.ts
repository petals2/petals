import fs from "fs";
import path from "path";

import { Vector2 } from "../types/vector2";
import { Asset } from "../asset";
import { PNG } from "pngjs";

export type SerializedCostume = {
  assetId: string;
  name: string;
  md5ext: string;
  dataFormat: string;
  rotationCenterX: number;
  rotationCenterY: number;
}

export class Costume extends Asset {
  protected rotationCenter: Vector2;

  static fromFile(filePath: string, name?: string) {
    const fileData = fs.readFileSync(filePath);
    return new Costume(path.basename(filePath), path.extname(filePath).substring(1) as "png"|"svg", fileData, undefined);
  }

  constructor(
    name: string,
    dataFormat: "png" | "svg",
    data: Buffer,
    rotationCenter: Vector2 | undefined,
  ) {
    super(name, dataFormat, data);

    if (rotationCenter) {
      this.rotationCenter = rotationCenter;
    } else {
      if (dataFormat === "png") {
        const { width, height } = PNG.sync.read(data);
        this.rotationCenter = new Vector2(width / 2, height / 2);
      } else if (dataFormat === "svg") {
        throw new Error("Cannot infer rotationCenter from svg");
      } else {
        throw new Error("Invalid data format " + dataFormat);
      }
    }
  }

  getRotationCenter(): Vector2 {
    return this.rotationCenter;
  }

  setRotationCenter(rotationCenter: Vector2): this {
    this.rotationCenter = rotationCenter;
    return this;
  }

  serialize(): SerializedCostume {
    return {
      ...super.serialize(),
      rotationCenterX: this.rotationCenter.getX(),
      rotationCenterY: this.rotationCenter.getY(),
    };
  }
}
