import { Node, ValueNode } from ".";
import { readValue } from "..";
import { UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class ArrayLiteralNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly contents: ValueNode[],
  ) {
    super(range);
  }

  getContents() { return this.contents }

  static build(reader: LexReader): ArrayLiteralNode {
    reader.openRange();

    if (!reader.nextIs({ type: TokenType.Separator, value: "[" })) {
      reader.pushLexError(new UnexpectedTokenError(`Expected Separator<"[">`, reader.read(), reader.closeRange()));
    }

    const contents = reader.readBetween("[");
    const values: ValueNode[] = [];

    while (!contents.isComplete()) {
      values.push(readValue(reader.getFile(), contents));

      if (contents.isComplete()) break;

      contents.expect({ type: TokenType.Separator, value: "," });
    }

    const range = reader.closeRange();

    return new ArrayLiteralNode(range, values);
  }
}
