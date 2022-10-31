import JSZip from "jszip";
import { SerializedProject } from "./project";
import { ProjectReference } from "./projectReference";

export class Sb3 implements ProjectReference {
  static async fromReference(buffer: Buffer | JSZip) {
    const zip = Buffer.isBuffer(buffer) ? await JSZip.loadAsync(buffer) : buffer;

    const pjson = await zip.file("project.json");

    if (pjson == undefined)
      throw new Error("No project.json file!");

    const json = JSON.parse(await pjson.async("string"));

    return new Sb3(json, zip);
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
