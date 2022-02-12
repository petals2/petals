import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";

export class NumberLiteralNode {
  type = <const> "numberLiteral";

  constructor (
    protected readonly tokenRange: TokenRange,
    protected readonly value: number,
  ) {}

  getTokenRange() {
    return this.tokenRange;
  }

  getValue() { return this.value }

  static build(reader: LexReader): NumberLiteralNode {
    const token = reader.expect({ type: TokenType.NumberLiteral });
    return new NumberLiteralNode(new TokenRange(token), token.value)
  }
}
