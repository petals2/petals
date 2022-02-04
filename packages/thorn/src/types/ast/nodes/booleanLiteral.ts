import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";

export class BooleanLiteralNode {
  type = <const> "booleanLiteral";

  constructor (
    protected readonly value: boolean,
  ) {}

  getValue() { return this.value }

  static build(reader: LexReader): BooleanLiteralNode {
    return new BooleanLiteralNode(reader.expect({ type: TokenType.BooleanLiteral }).value)
  }
}
