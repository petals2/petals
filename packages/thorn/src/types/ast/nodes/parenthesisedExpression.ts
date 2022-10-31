import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { buildPemdas } from "../../../routines/PEMDAS";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange } from "../../token";
import { ValueTreeNode } from "../node";
import { SelfReferenceNode } from "./selfReferenceNode";

export class ParenthesisedExpressionNode {
  type = <const>"parenthesisedExpressionNode";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly contents: ValueTreeNode,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getContents() { return this.contents }

  static build(reader: LexReader): ParenthesisedExpressionNode {
    const val = readValue(reader);
    
    if (val instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(val));
    }

    return new ParenthesisedExpressionNode(new TokenRange(val.getTokenRange()), buildPemdas(val));
  }
}