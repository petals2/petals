import { Node } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";
import type { ValueNode } from ".";
import { ThornError } from "../../errors/thornError";
import { InvalidLexStateError } from "../../errors/invalidLexState";
import { SafeUnexpectedTokenError, UnexpectedTokenError } from "../../errors/unexpectedToken";
import { readValue } from "..";
import { Type } from "../type";
import { readType } from "../type/readType";
import { IdentifierNode } from "./identifier";

export class VariableDefinitionNode extends Node {
  static validAssignmentMethods = ["+=", "-=", "*=", "/=", "="]

  constructor(
    range: TokenRange,
    protected readonly exported: boolean,
    protected readonly constant: boolean,
    protected readonly variableName: IdentifierNode,
    protected readonly assignmentMethod: string,
    protected readonly value: ValueNode,
    protected readonly type?: Type,
  ) {
    super(range);
  }

  getVariableName() { return this.variableName }
  getValue() { return this.value }
  isConstant() { return this.constant }
  getType() { return this.type }

  static build(reader: LexReader) {
    reader.openRange();

    const exported = reader.nextIs({ type: TokenType.Keyword, value: "export" });

    if (exported) reader.expect({ type: TokenType.Keyword, value: "export" })

    const next = reader.read();

    if (next.type !== TokenType.Keyword || (next.value !== "const" && next.value !== "let")) {
      reader.pushLexError(new UnexpectedTokenError(`Expected one of Keyword<"const", "let">`, next, reader.closeRange()));
      // pushLexError garunteed to throw
    }

    const constant = next.value === "const";
    const variableNameToken = reader.expect({ type: TokenType.Identifier });
    const variableName = new IdentifierNode(TokenRange.fromArray(reader.getFile(), [ variableNameToken ]), variableNameToken.value);

    let type: Type | undefined = undefined;

    if (reader.nextIs({ type: TokenType.Separator, value: ":" })) {
      reader.read();

      type = readType(reader);
    }

    const assignmentMethod = reader.expect({ type: TokenType.Separator });

    if (!VariableDefinitionNode.validAssignmentMethods.includes(assignmentMethod.value)) {
      reader.pushLexError(new UnexpectedTokenError(`Expected one of Separator<"${VariableDefinitionNode.validAssignmentMethods.join('", "')}">`, assignmentMethod, reader.closeRange()))
      // pushLexError garunteed to throw  
    }

    const value = readValue(reader.getFile(), reader);
    const range = reader.closeRange();

    if (!reader.nextIs({ type: TokenType.Separator, value: ";" })) {
      const token = reader.peek();

      reader.pushLexError(new SafeUnexpectedTokenError(`Expected Separator<";">`, token, TokenRange.fromArray(reader.getFile(), [token])))
    } else {
      reader.read();
    }

    return new VariableDefinitionNode(range, exported, constant, variableName, assignmentMethod.value, value, type);
  }
}
