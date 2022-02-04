import { buildAst, readNode } from "../../../routines/buildAst";
import { readValue } from "../../../routines/buildAst/readValue";
import { buildPemdas } from "../../../routines/PEMDAS";
import { LexReader } from "../../reader/lexReader";
import { TokenType, validOperators } from "../../token";
import { TreeNode, ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";

export class ForNode {
  type = <const>"forNode";

  constructor(
    protected readonly firstStep: TreeNode,
    protected readonly secondStep: ValueTreeNode,
    protected readonly thirdStep: TreeNode,
    protected readonly contents: TreeNode[],
  ) { }

  getFirstStep() { return this.firstStep }
  getSecondStep() { return this.secondStep }
  getThirdStep() { return this.thirdStep }
  getContents() { return this.contents }

  static build(reader: LexReader): ForNode | ComparisonOperationNode {
    reader.expect({ type: TokenType.Keyword, value: "for" });

    const contents = reader.readBetween("(");

    const a = readNode(contents);
    const b = readValue(contents);
    const c = readNode(contents);

    const realContents = reader.readBetween("{");

    const realContentsAstd = buildAst(realContents);

    return new ForNode(a, b, c, realContentsAstd);
  }
}
