import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";

export class StringLiteralNode {
  type = <const> "stringLiteral";

  constructor (
    protected readonly tokenRange: TokenRange,
    protected readonly value: string,
  ) {}

  getTokenRange() {
    return this.tokenRange;
  }

  getValue() { return this.value }

  static build(reader: LexReader): StringLiteralNode {
    const stringToken = reader.expect({ type: TokenType.StringLiteral });
    return new StringLiteralNode(new TokenRange(stringToken), stringToken.value)
  }
}