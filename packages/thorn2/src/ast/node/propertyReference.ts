import { Node, ValueNode } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class PropertyReferenceNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly base: ValueNode,
    protected readonly property: string,
  ) {
    super(range);
  }

  getBase() { return this.base }
  getProperty() { return this.property }

  static build(base: ValueNode, reader: LexReader): PropertyReferenceNode {
    reader.openRange();

    reader.expect({ type: TokenType.Separator, value: "." });

    const property = reader.expect({ type: TokenType.Identifier });

    const baseRange = reader.closeRange();
    const range = new TokenRange(reader.getFile(), base.getTokenRange(), baseRange);

    return new PropertyReferenceNode(range, base, property.value);
  }
}
