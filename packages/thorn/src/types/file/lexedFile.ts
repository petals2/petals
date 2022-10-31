import { lex } from "../../routines/lexFile";
import { Project } from "../project";
import { LexReader } from "../reader/lexReader";
import { File } from "./file";
import { TextFile } from "./textFile";

export class LexedFile extends File<LexReader> {
  constructor(public readonly contents: LexReader, relativePath: string, public project: Project<LexedFile>) {
    super(relativePath);
  }

  static fromText(file: TextFile): LexedFile {
    return new LexedFile(new LexReader(lex(file.contents)), file.projectRelativePath, file.project as any);
  }
}