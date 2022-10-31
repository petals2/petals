import { Node, ValueNode } from ".";
import { readValue } from "..";
import { SafeUnexpectedTokensError, UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class IndexReferenceNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly base: ValueNode,
    protected readonly index: ValueNode,
  ) {
    super(range)
  }

  getBase() { return this.base }
  getIndex() { return this.index }

  static build(base: ValueNode, reader: LexReader): IndexReferenceNode {
    reader.openRange();

    if (!reader.nextIs({ type: TokenType.Separator, value: "[" })) {
      reader.pushLexError(new UnexpectedTokenError(`Expected Separator<"[">`, reader.read(), reader.closeRange()));
    }

    const subreader = reader.readBetween("[");

    const index = readValue(reader.getFile(), subreader);

    if (!subreader.isComplete()) {
      const unexpected = [];

      while (!subreader.isComplete()) {
        unexpected.push(subreader.read());
      }

      throw new SafeUnexpectedTokensError("Unexpected tokens after index", reader.getFile(), unexpected);
    }

    const baseRange = reader.closeRange();
    const range = new TokenRange(reader.getFile(), base.getTokenRange(), baseRange);

    return new IndexReferenceNode(range, base, index);
  }
}
