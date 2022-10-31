import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { ValueTreeNode } from "../node";
import { SelfReferenceNode } from "./selfReferenceNode";

export class ReturnNode {
  type = <const>"return";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly value: ValueTreeNode,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getValue() { return this.value }

  static build(reader: LexReader): ReturnNode {
    const returnToken = reader.expect({ type: TokenType.Keyword, value: "return" });

    const val = readValue(reader);
    
    if (val instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(val));
    }

    return new ReturnNode(new TokenRange(returnToken, val.getTokenRange().getEnd()), val);
  }
}