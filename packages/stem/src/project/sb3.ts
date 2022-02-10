import JSZip from "jszip";
import { SerializedProject } from "./project";

export class Sb3 {
    static async fromSb3(buffer: Buffer) {
        const zip = new JSZip(buffer);
    }

    constructor(
        private readonly json: SerializedProject,
        private readonly zip: JSZip
    ) {}

    getJson() {
        return this.json;
    }

    getAsset(fileName: string) {
        if (fileName === "project.json") {
            throw new Error("Not a valid asset file!");
        }

        return this.zip.file(fileName)?.async("nodebuffer");
    }
}
