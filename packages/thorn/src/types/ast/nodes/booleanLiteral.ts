import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";

export class BooleanLiteralNode {
  type = <const> "booleanLiteral";

  constructor (
    protected readonly tokenRange: TokenRange,
    protected readonly value: boolean,
  ) {}

  getTokenRange() {
    return this.tokenRange;
  }

  getValue() { return this.value }

  static build(reader: LexReader): BooleanLiteralNode {
    const read = reader.expect({ type: TokenType.BooleanLiteral });
    return new BooleanLiteralNode(new TokenRange(read), read.value)
  }
}
