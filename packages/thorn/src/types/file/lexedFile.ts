import { LexReader } from "../reader/lexReader";
import { Project } from "../project";
import { File } from "./file";
import { TextFile } from "./textFile";
import { lex } from "../../routines/lexFile";

export class LexedFile extends File<LexReader> {
  constructor(public readonly contents: LexReader, relativePath: string, public project: Project<LexedFile>) {
    super(relativePath);
  }

  static fromText(file: TextFile): LexedFile {
    return new LexedFile(new LexReader(lex(file.contents)), file.projectRelativePath, file.project as any);
  }
}
