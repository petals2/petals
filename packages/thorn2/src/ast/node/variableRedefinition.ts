import { Node } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";
import type { ValueNode } from ".";
import { ThornError } from "../../errors/thornError";
import { InvalidLexStateError } from "../../errors/invalidLexState";
import { SafeUnexpectedTokenError, UnexpectedTokenError } from "../../errors/unexpectedToken";
import { readValue } from "..";
import { IdentifierNode } from "./identifier";
import { InvalidLeftHand } from "../../errors/invalidLeftHand";

export class VariableRedefinitionNode extends Node {
  static validAssignmentMethods = ["+=", "-=", "*=", "/=", "="]

  constructor(
    range: TokenRange,
    protected readonly base: IdentifierNode,
    protected readonly assignmentMethod: string,
    protected readonly value: ValueNode,
  ) {
    super(range);
  }

  getBase() { return this.base }
  getValue() { return this.value }
  getAssignmentMethod() { return this.assignmentMethod }

  static build(base: ValueNode, reader: LexReader) {
    if (!(base instanceof IdentifierNode)) {
      reader.pushLexError(new InvalidLeftHand("Invalid left-hand in assignment. Can only be an Identifier", base, base.getTokenRange()))
      // pushLexError garunteed to throw
      throw 0;
    }

    reader.openRange();

    const assignmentMethod = reader.expect({ type: TokenType.Separator });

    if (!VariableRedefinitionNode.validAssignmentMethods.includes(assignmentMethod.value)) {
      reader.pushLexError(new UnexpectedTokenError(`Expected one of Separator<"${VariableRedefinitionNode.validAssignmentMethods.join('", "')}">`, assignmentMethod, reader.closeRange()))
      // pushLexError garunteed to throw
      throw 0
    }

    const value = readValue(reader.getFile(), reader);
    const range = reader.closeRange();

    return new VariableRedefinitionNode(range, base, assignmentMethod.value, value);
  }
}
