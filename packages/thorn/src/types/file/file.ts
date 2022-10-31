import path from "path";

import { Project } from "../project";

export abstract class File<T> {
  public abstract contents: T;
  public abstract project: Project<File<T>>;

  constructor(
    public projectRelativePath: string
  ) {}

  get path(): string {
    return path.join(this.project.getAbsolutePath(), this.projectRelativePath);
  }
}