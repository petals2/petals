import { Node } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class IdentifierNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly identifier: string,
  ) {
    super(range);
  }

  getIdentifier() { return this.identifier }

  static build(reader: LexReader): IdentifierNode {
    reader.openRange();

    const identifier = reader.expect({ type: TokenType.Identifier })

    const range = reader.closeRange();

    return new IdentifierNode(range, identifier.value);
  }
}
