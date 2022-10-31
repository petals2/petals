import { Node, ValueNode } from ".";
import { readValue } from "..";
import { UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class FunctionCallNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly base: ValueNode,
    protected readonly args: ValueNode[],
  ) {
    super(range)
  }

  getBase(): ValueNode {
    return this.base;
  }

  getArgs(): ValueNode[] {
    return this.args;
  }

  static build(base: ValueNode, reader: LexReader): FunctionCallNode {
    reader.openRange();

    if (!reader.nextIs({ type: TokenType.Separator, value: "(" })) {
      reader.pushLexError(new UnexpectedTokenError("Expected function call", reader.read(), reader.closeRange()));
    }

    const argumentReader = reader.readBetween("(");
    const args: ValueNode[] = [];

    while (!argumentReader.isComplete()) {
      args.push(readValue(reader.getFile(), argumentReader));

      if (argumentReader.isComplete()) break;

      argumentReader.expect({ type: TokenType.Separator, value: "," });
    }

    const baseRange = reader.closeRange();
    const range = new TokenRange(reader.getFile(), base.getTokenRange(), baseRange);
  
    return new FunctionCallNode(range, base, args);
  }
}
