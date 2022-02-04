import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";

export class NumberLiteralNode {
  type = <const> "numberLiteral";

  constructor (
    protected readonly value: number,
  ) {}

  getValue() { return this.value }

  static build(reader: LexReader): NumberLiteralNode {
    return new NumberLiteralNode(reader.expect({ type: TokenType.NumberLiteral }).value)
  }
}
