import { buildAst } from "../../routines/buildAst";
import { TreeNode } from "../ast/node";
import { Project } from "../project";
import { File } from "./file";
import { LexedFile } from "./lexedFile";

export class AstFile extends File<TreeNode[]> {
  constructor(public readonly contents: TreeNode[], relativePath: string, public project: Project<AstFile>) {
    super(relativePath);
  }

  static fromLexed(file: LexedFile): AstFile {
    return new AstFile(buildAst(file.contents), file.projectRelativePath, file.project as any);
  }
}