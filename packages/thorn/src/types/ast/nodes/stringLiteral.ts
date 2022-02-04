import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";

export class StringLiteralNode {
  type = <const> "stringLiteral";

  constructor (
    protected readonly value: string,
  ) {}

  getValue() { return this.value }

  static build(reader: LexReader): StringLiteralNode {
    return new StringLiteralNode(reader.expect({ type: TokenType.StringLiteral }).value)
  }
}
