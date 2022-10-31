import { Node, ValueNode } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class DecrementNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly base: ValueNode,
  ) {
    super(range)
  }

  getBase() { return this.base }

  static build(base: ValueNode, reader: LexReader): DecrementNode {
    reader.openRange();

    reader.expect({ type: TokenType.Operator, value: "--" });

    const baseRange = reader.closeRange();
    const range = new TokenRange(reader.getFile(), base.getTokenRange(), baseRange);
  
    return new DecrementNode(range, base);
  }
}
