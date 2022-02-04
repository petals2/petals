import { StringReader } from "petals-utils";
import { TextFile } from "./file/textFile";
import { File } from "./file/file";
import { SILO } from "petals-silo";
import path from "path";
import fs from "fs";
import { LexedFile } from "./file/lexedFile";
import { AstFile } from "./file/astFile";

export type Manifest = {
  index: string;
  name: string;
};

export class Project<T extends File<any>> {
  constructor(
    public readonly absolutePath: string,
    public readonly contents: T[],
    public readonly manifest: Manifest,
  ) {}

  static fromManifestPath(manifestAbsoluteFilePath: string): Project<AstFile> {
    const projectPath = path.join(manifestAbsoluteFilePath, "..");
    const manifest = SILO.parse(fs.readFileSync(manifestAbsoluteFilePath, "utf-8")) as Manifest;

    return this.fromManifest(manifest, projectPath);
  }

  static fromManifest(manifest: Manifest, absoluteProjectPath: string): Project<AstFile> {
    const project = new Project(absoluteProjectPath, [], manifest);

    const files = this.recursiveFileDiscovery(absoluteProjectPath, "", ["costumes", "sounds", "sprites"]).map(file => {
      return AstFile.fromLexed(LexedFile.fromText(new TextFile(new StringReader(fs.readFileSync(path.join(absoluteProjectPath, file), "utf-8")), file, project)));
    });

    //@ts-ignore
    project.contents = files;

    return project;
  }

  private static recursiveFileDiscovery(absolutePath: string, currentPath = "", exclude: string[] = []): string[] {
    const directory = fs.readdirSync(absolutePath).filter(v => !exclude.includes(v));
    let results: string[] = [];

    for (const fileName of directory) {
      const fullPath = path.join(absolutePath, fileName);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        results.push(...this.recursiveFileDiscovery(fullPath, path.join(currentPath, fileName)).map(fileName2 => path.join(currentPath, fileName, fileName2)));
      } else if (stat.isFile() && fileName.toLowerCase().endsWith(".tn")) {
        results.push(fileName);
      }
    }

    return results;
  }
}
