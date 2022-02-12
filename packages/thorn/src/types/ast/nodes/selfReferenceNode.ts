import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";

export class SelfReferenceNode {
  type = <const>"selfReference";

  constructor (
    protected readonly tokenRange: TokenRange,
    protected readonly variableName: string,
  ) {}

  getTokenRange() {
    return this.tokenRange;
  }

  getName() { return this.variableName }

  static build(reader: LexReader): SelfReferenceNode {
    const selfToken = reader.expect({ type: TokenType.Identifier, value: "self" });
    return new SelfReferenceNode(new TokenRange(selfToken), selfToken.value);
  }
}
