import { Vector2 } from "../types/vector2";
import { Asset } from "../asset";
import { PNG } from "pngjs";
import { Project } from "../project";
import { ProjectReference } from "../project/projectReference";

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

  static async fromReference(project: Project, reference: ProjectReference, json: SerializedCostume) {
    const asset = await reference.getAsset(json.md5ext);

    if (!asset) {
      throw new Error("Failed to load costume from JSON: missing asset: " + json.md5ext);
    }

    return new Costume(json.name, json.dataFormat as "png"|"svg", asset, new Vector2(json.rotationCenterX, json.rotationCenterY));
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
