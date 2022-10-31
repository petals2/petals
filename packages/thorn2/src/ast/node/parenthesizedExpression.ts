import { Node, ValueNode } from ".";
import { readValue } from "..";
import { SafeUnexpectedTokensError, UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class ParenthesizedExpressionNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly value: ValueNode,
  ) {
    super(range)
  }

  getValue() { return this.value }

  static build(reader: LexReader): ParenthesizedExpressionNode {
    reader.openRange();

    if (!reader.nextIs({ type: TokenType.Separator, value: "(" })) {
      reader.pushLexError(new UnexpectedTokenError(`Expected Separator<"(">`, reader.read(), reader.closeRange()));
    }

    const contents = reader.readBetween("(");

    const value = readValue(reader.getFile(), contents);

    if (!contents.isComplete()) {
      const unexpected = [];

      while (!contents.isComplete()) {
        unexpected.push(contents.read());
      }

      reader.pushLexError(new SafeUnexpectedTokensError(reader.getFile(), `Unexpected tokens after expression`, unexpected));
    }

    return new ParenthesizedExpressionNode(reader.closeRange(), value);
  }
}
