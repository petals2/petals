import { StringReader } from "petals-utils";

import { Project } from "../project";
import { File } from "./file";

export class TextFile extends File<StringReader> {
  constructor(public readonly contents: StringReader, relativePath: string, public project: Project<TextFile>) {
    super(relativePath);
  }
}