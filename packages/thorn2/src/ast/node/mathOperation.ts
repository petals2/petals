import { Node, ValueNode } from ".";
import { readValue } from "..";
import { UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class MathOperationNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly leftHand: ValueNode,
    protected readonly operation: "+" | "-" | "*" | "/",
    protected readonly rightHand: ValueNode,
  ) {
    super(range);
  }

  getLeftHand() { return this.leftHand }
  getRightHand() { return this.rightHand }

  getOperation() { return this.operation }

  static build(base: ValueNode, reader: LexReader): MathOperationNode {
    reader.openRange();

    const operation = reader.expect({ type: TokenType.Operator });

    if (!["+", "-", "*", "/"].includes(operation.value)) {
      reader.pushLexError(new UnexpectedTokenError(`Expected Operator<"+", "-", "/", "*">`, operation, reader.closeRange()));
    }

    const rightHand = readValue(reader.getFile(), reader);

    const baseRange = reader.closeRange();
    const range = new TokenRange(reader.getFile(), base.getTokenRange(), baseRange);

    return new MathOperationNode(range, base, operation.value as any, rightHand);
  }
}
