import { buildAst, readNode } from "../../../routines/buildAst";
import { readValue } from "../../../routines/buildAst/readValue";
import { lex } from "../../../routines/lexFile";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { TreeNode, ValueTreeNode } from "../node";

export class ifBlockNode {
  type = <const>"ifBlock";

  constructor(
    protected readonly comparison: ValueTreeNode,
    protected readonly contents: TreeNode[],
    protected readonly elseContents: TreeNode[] | undefined,
  ) { }

  getComparison() { return this.comparison }
  getContents() { return this.contents }
  getElseContents() { return this.elseContents }

  static build(reader: LexReader): ifBlockNode {
    reader.expect({ type: TokenType.Keyword, value: "if" });
    const comparison = readValue(reader);

    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      const contents = buildAst(reader.readBetween("{"));
      var elseContents: TreeNode[] | undefined = undefined;
  
      if (reader.nextIs({ type: TokenType.Keyword, value: "else" })) {
        reader.read();
  
        elseContents = buildAst(reader.readBetween("{"));
      }
  
      return new ifBlockNode(comparison, contents, elseContents)
    }

    const trueCase = readNode(reader);
    let elseCase: TreeNode[] | undefined = undefined;

    if (reader.nextIs({ type: TokenType.Keyword, value: "else" })) {
      reader.read();

      if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
        elseCase = buildAst(reader.readBetween("{"));
      } else {
        elseCase = [readNode(reader)];
      }
    }

    return new ifBlockNode(comparison, [trueCase], elseCase);
  }
}
