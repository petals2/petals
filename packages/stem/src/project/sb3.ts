import JSZip from "jszip";
import { SerializedProject } from "./project";
import { ProjectReference } from "./projectReference";

export class Sb3 implements ProjectReference {
  static async fromReference(buffer: Buffer) {
    const zip = new JSZip(buffer);
  }

  constructor(
    private readonly json: SerializedProject,
    private readonly zip: JSZip
  ) { }

  async getJson(): Promise<SerializedProject> {
    return this.json;
  }

  async getAsset(fileName: string): Promise<Buffer | undefined> {
    if (fileName === "project.json") {
      throw new Error("Not a valid asset file!");
    }

    return await this.zip.file(fileName)?.async("nodebuffer");
  }
}
