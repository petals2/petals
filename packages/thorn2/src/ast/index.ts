import { SafeUnexpectedTokenError, UnexpectedTokenError } from "../errors/unexpectedToken";
import { LexReader } from "../lexer/lexReader";
import { TokenRange, TokenType } from "../lexer/token";
import type { TreeNode, ValueNode } from "./node";
import { ArrayLiteralNode } from "./node/arrayLiteral";
import { ArrowFunctionNode } from "./node/arrowFunction";
import { ComparisonNode } from "./node/comparison";
import { ForNode } from "./node/for";
import { FunctionCallNode } from "./node/functionCall";
import { FunctionDefinitionNode } from "./node/functionDefinition";
import { IdentifierNode } from "./node/identifier";
import { IfNode } from "./node/if";
import { ImportNode } from "./node/import";
import { IncrementNode } from "./node/increment";
import { IndexReferenceNode } from "./node/indexReference";
import { LiteralNode } from "./node/literal";
import { MathOperationNode } from "./node/mathOperation";
import { ParenthesizedExpressionNode } from "./node/parenthesizedExpression";
import { PropertyReferenceNode } from "./node/propertyReference";
import { ReturnNode } from "./node/return";
import { VariableDefinitionNode } from "./node/variableDefinition";
import { VariableRedefinitionNode } from "./node/variableRedefinition";
import { WhileNode } from "./node/while";

export function buildAst(file: string, reader: LexReader) {
  const nodes: TreeNode[] = [];

  while (!reader.isComplete()) {
    nodes.push(readStatement(file, reader));
  }

  return nodes;
}

export function readStatement(file: string, reader: LexReader): TreeNode {
  if (reader.nextIs({ type: TokenType.Keyword, value: "export" })) {
    const peek = reader.peek(1);

    if (peek.type == TokenType.Keyword && (peek.value == "let" || peek.value == "const")) {
      return VariableDefinitionNode.build(reader);
    }

    if (peek.type === TokenType.Keyword && peek.value == "function") {
      return FunctionDefinitionNode.build(reader);
    }

    reader.pushLexError(new UnexpectedTokenError("Can only export function and variable definitions", peek, TokenRange.fromArray(file, [ peek ])));
  }

  if (reader.nextIs({ type: TokenType.Keyword, value: "let" }, { type: TokenType.Keyword, value: "const" })) {
    return VariableDefinitionNode.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Keyword, value: "if" })) {
    return IfNode.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Keyword, value: "while" })) {
    return WhileNode.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Keyword, value: "for" })) {
    return ForNode.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Keyword, value: "function" })) {
    return FunctionDefinitionNode.build(reader)
  }

  if (reader.nextIs({ type: TokenType.Keyword, value: "return" })) {
    return ReturnNode.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Keyword, value: "import" })) {
    return ImportNode.build(reader);
  }

  const v = readValue(file, reader);

  if (!reader.nextIs({ type: TokenType.Separator, value: ";" })) {
    const token = reader.peek();

    reader.pushLexError(new SafeUnexpectedTokenError(`Expected Separator<";">`, token, TokenRange.fromArray(file, [token])))
  } else {
    reader.read();
  }

  return v;
}

export function readValue(file: string, reader: LexReader): ValueNode {
  let v = readBaseValue(file, reader);
  let lv = undefined;

  while(v != lv) {
    lv = v;
    v = readComplexValue(v, reader);
  }

  return v;
}

export function readComplexValue(base: ValueNode, reader: LexReader) {
  if (reader.nextIs({ type: TokenType.Comparison })) {
    return ComparisonNode.build(base, reader)
  }

  if (reader.nextIs({ type: TokenType.Operator, value: "++"})) {
    return IncrementNode.build(base, reader)
  }

  if (reader.nextIs({ type: TokenType.Operator, value: "--" })) {
    return IncrementNode.build(base, reader)
  }

  if (reader.nextIs({ type: TokenType.Operator }) && !reader.nextIs({ type: TokenType.Operator, value: "!" })) {
    return MathOperationNode.build(base, reader)
  }

  if (reader.nextIs({ type: TokenType.Separator, value: "." })) {
    return PropertyReferenceNode.build(base, reader);
  }

  if (reader.nextIs({ type: TokenType.Separator, value: "[" })) {
    return IndexReferenceNode.build(base, reader);
  }

  if (reader.nextIs(
    { type: TokenType.Separator, value: "=" },
    { type: TokenType.Separator, value: "+=" },
    { type: TokenType.Separator, value: "-=" },
    { type: TokenType.Separator, value: "*=" },
    { type: TokenType.Separator, value: "/=" },
  )) {
    return VariableRedefinitionNode.build(base, reader);
  }

  if (reader.nextIs({ type: TokenType.Separator, value: "(" })) {
    return FunctionCallNode.build(base, reader);
  }

  return base;
}

export function readBaseValue(file: string, reader: LexReader): ValueNode {
  if (reader.nextIs({ type: TokenType.BooleanLiteral }, { type: TokenType.NumberLiteral }, { type: TokenType.StringLiteral })) {
    return LiteralNode.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Identifier })) {
    return IdentifierNode.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Separator, value: "(" })) {
    const clone = reader.clone();

    clone.readBetween("(");

    if (clone.nextIs({ type: TokenType.Separator, value: "=>" }))
      return ArrowFunctionNode.build(reader);

    return ParenthesizedExpressionNode.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Keyword, value: "async" })) {
    return ArrowFunctionNode.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Separator, value: "[" })) {
    return ArrayLiteralNode.build(reader);
  }

  throw new Error("TODO");
}
