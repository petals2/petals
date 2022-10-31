import { Node } from ".";
import { UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class LiteralNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly value: string | number | boolean,
  ) {
    super(range);
  }

  getValue() { return this.value }

  static build(reader: LexReader): LiteralNode {
    reader.openRange();

    if (!reader.nextIs({ type: TokenType.NumberLiteral }, { type: TokenType.BooleanLiteral }, { type: TokenType.StringLiteral })) {
      reader.pushLexError(new UnexpectedTokenError("Expected a literal.", reader.read(), reader.closeRange()))
    }

    const { value } = reader.read();
    const range = reader.closeRange();

    return new LiteralNode(range, value);
  }
}
