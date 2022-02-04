import { buildAst, readNode } from "../../../routines/buildAst";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { TreeNode, ValueTreeNode } from "../node";

export class WhileNode {
  type = <const> "while";

  constructor (
    protected readonly kase: ValueTreeNode,
    protected readonly block: TreeNode[],
  ) {}

  getCase() { return this.kase }
  getBlock() { return this.block }

  static build(reader: LexReader): WhileNode {
    reader.expect({ type: TokenType.Keyword, value: "while" });

    const kase = readValue(reader);
    let contents: TreeNode[];

    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      contents = buildAst(reader.readBetween("{"));
    } else {
      contents = [readNode(reader)];
    }

    return new WhileNode(kase, contents);
  }
}
