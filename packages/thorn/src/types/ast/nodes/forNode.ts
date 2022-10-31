import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { buildAst, readNode } from "../../../routines/buildAst";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { TreeNode, ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";
import { SelfReferenceNode } from "./selfReferenceNode";

export class ForNode {
  type = <const>"forNode";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly firstStep: TreeNode,
    protected readonly secondStep: ValueTreeNode,
    protected readonly thirdStep: TreeNode,
    protected readonly contents: TreeNode[],
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getFirstStep() { return this.firstStep }
  getSecondStep() { return this.secondStep }
  getThirdStep() { return this.thirdStep }
  getContents() { return this.contents }

  static build(reader: LexReader): ForNode | ComparisonOperationNode {
    const forToken = reader.expect({ type: TokenType.Keyword, value: "for" });

    const contents = reader.readBetween("(");

    const a = readNode(contents);
    const b = readValue(contents);
    const c = readNode(contents);
    
    if (b instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(b));
    }

    const realContents = reader.readBetween("{");
    const realContentsAst = buildAst(realContents);

    return new ForNode(new TokenRange(forToken, realContents.getRange().getEnd()), a, b, c, realContentsAst);
  }
}