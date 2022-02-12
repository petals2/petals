import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";

export class SelfReferenceNode {
  type = <const>"selfReference";

  constructor (
    protected readonly tokenRange: TokenRange,
  ) {}

  getTokenRange() {
    return this.tokenRange;
  }

  static build(reader: LexReader): SelfReferenceNode {
    const selfToken = reader.expect({ type: TokenType.Keyword, value: "self" });
    return new SelfReferenceNode(new TokenRange(selfToken));
  }
}
