import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { ValueTreeNode } from "../node";
import { SelfReferenceNode } from "./selfReferenceNode";

export class FreeNode {
  type = <const>"free";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly value: ValueTreeNode,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getValue() { return this.value }

  static build(reader: LexReader): FreeNode {
    const freeToken = reader.expect({ type: TokenType.Keyword, value: "free" });

    const value = readValue(reader);
    
    if (value instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(value));
    }

    return new FreeNode(new TokenRange(freeToken, value.getTokenRange().getEnd()), value);
  }
}
