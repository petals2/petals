import { readValue } from "../../../routines/buildAst/readValue";
import { buildPemdas } from "../../../routines/PEMDAS";
import { LexReader } from "../../reader/lexReader";
import { ValueTreeNode } from "../node";

export class ParenthesisedExpressionNode {
  type = <const>"parenthesisedExpressionNode";

  constructor(
    protected readonly contents: ValueTreeNode,
  ) { }

  getContents() { return this.contents }

  static build(reader: LexReader): ParenthesisedExpressionNode {
    return new ParenthesisedExpressionNode(buildPemdas(readValue(reader)));
  }
}
