import { Node, ValueNode } from ".";
import { readValue } from "..";
import { SafeUnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class ReturnNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly value: ValueNode,
  ) {
    super(range)
  }

  static build(reader: LexReader): ReturnNode {
    reader.openRange();

    reader.expect({ type: TokenType.Keyword, value: "return" });

    const value = readValue(reader.getFile(), reader);

    if (!reader.nextIs({ type: TokenType.Separator, value: ";" })) {
      const token = reader.peek();

      reader.pushLexError(new SafeUnexpectedTokenError(`Expected Separator<";">`, token, TokenRange.fromArray(reader.getFile(), [token])))
    } else {
      reader.read();
    }
  
    return new ReturnNode(reader.closeRange(), value);
  }
}
