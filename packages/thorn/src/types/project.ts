import { SILO } from "petals-silo";
import { StringReader } from "petals-utils";
import fs from "fs";
import path from "path";

import { ThornError } from "../errors/thornError";
import { AstFile } from "./file/astFile";
import { File } from "./file/file";
import { LexedFile } from "./file/lexedFile";
import { TextFile } from "./file/textFile";

export type Manifest = {
  index: string;
  name: string;
};

export class Project<T extends File<any>> {
  protected readonly errors: Map<string, ThornError[]>;

  constructor(
    protected absolutePath: string,
    protected contents: T[],
    protected manifest: Manifest
  ) {
    this.errors = new Map;
  }

  static fromManifestPath(manifestAbsoluteFilePath: string): Project<AstFile> {
    const projectPath = path.join(manifestAbsoluteFilePath, "..");
    const manifest = SILO.parse(fs.readFileSync(manifestAbsoluteFilePath, "utf-8")) as Manifest;

    return this.fromManifest(manifest, projectPath);
  }

  static fromManifest(manifest: Manifest, absoluteProjectPath: string): Project<AstFile> {
    const project = new Project(absoluteProjectPath, [] as File<any>[], manifest);

    const files = this.recursiveFileDiscovery(absoluteProjectPath, "", ["costumes", "sounds", "sprites"]).map(file => {
      const filePath = path.join(absoluteProjectPath, file);
      const lexedFile = LexedFile.fromText(new TextFile(new StringReader(fs.readFileSync(filePath, "utf8")), file, project));

      const astFile = AstFile.fromLexed(lexedFile);

      project.addFileErrors(filePath, lexedFile.contents.getErrors());

      return astFile;
    });

    project.setContents(files as File<any>[]);

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

  addFileErrors(filePath: string, errors: ThornError[]) {
    const cachedErrors = this.errors.get(filePath);
    if (cachedErrors) {
      cachedErrors.push(...errors);
      return;
    }

    this.errors.set(filePath, [...errors]);
  }

  protected setContents(contents: T[]) {
    this.contents = contents;
  }

  getContents() {
    return this.contents;
  }

  getAbsolutePath() {
    return this.absolutePath;
  }

  getManifest() {
    return this.manifest;
  }

  getFileErrors() {
    return this.errors;
  }
}