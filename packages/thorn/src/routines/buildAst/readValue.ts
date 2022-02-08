import { SILO } from "petals-silo";
import { ValueTreeNode } from "../../types/ast/node";
import { ArrayLiteralNode } from "../../types/ast/nodes/arrayLiteral";
import { BooleanLiteralNode } from "../../types/ast/nodes/booleanLiteral";
import { ComparisonOperationNode } from "../../types/ast/nodes/comparisonOperation";
import { DecrementOperatorNode } from "../../types/ast/nodes/decrementOperator";
import { IncrementOperatorNode } from "../../types/ast/nodes/incrementOperator";
import { IndexReferenceNode } from "../../types/ast/nodes/indexReference";
import { MathOperationNode } from "../../types/ast/nodes/mathOperation";
import { MethodCallNode } from "../../types/ast/nodes/methodCall";
import { MethodDefinitionNode } from "../../types/ast/nodes/methodDefinition";
import { NegateOperator } from "../../types/ast/nodes/NegateOperator";
import { NumberLiteralNode } from "../../types/ast/nodes/numberLiteral";
import { ParenthesisedExpressionNode } from "../../types/ast/nodes/parenthesisedExpression";
import { PropertyReferenceNode } from "../../types/ast/nodes/propertyReference";
import { HeapCopyOperation } from "../../types/ast/nodes/stackCopyOperation";
import { StringLiteralNode } from "../../types/ast/nodes/stringLiteral";
import { StructLiteralNode } from "../../types/ast/nodes/structLiteral";
import { VariableRedefinitionNode } from "../../types/ast/nodes/variableRedefinitionNode";
import { VariableReferenceNode } from "../../types/ast/nodes/variableReference";
import { LexReader } from "../../types/reader/lexReader";
import { TokenType } from "../../types/token";

export function readValue(reader: LexReader): ValueTreeNode {
  let basic: ValueTreeNode

  if (reader.nextIs({ type: TokenType.Separator, value: "&" })) {
    return HeapCopyOperation.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Identifier })) {
    const peekFurther = reader.peek(1);

    if (peekFurther && peekFurther.type === TokenType.Separator && peekFurther.value === "&") {
      return HeapCopyOperation.build(reader);
    }
  }

  if (reader.nextIs({ type: TokenType.Operator, value: "!"})) {
    return NegateOperator.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Separator, value: "(" })) {
    const argumentReader = reader.readBetween("(");

    basic = ParenthesisedExpressionNode.build(argumentReader);
  } else {
    basic = readBasicValue(reader);
  }

  while (reader.nextIs({ type: TokenType.Separator, value: "("}, { type: TokenType.Operator })) {
    if (reader.nextIs({ type: TokenType.Separator, value: "(" })) {
      const argumentReader = reader.readBetween("(");
      const args: ValueTreeNode[] = [];
  
      while (!argumentReader.isComplete()) {
        args.push(readValue(argumentReader));
  
        if (argumentReader.nextIs({ type: TokenType.Separator, value: "," })) {
          argumentReader.read();
        }
      }
  
      basic = new MethodCallNode(basic, args);
    }

    if (reader.nextIs({ type: TokenType.Operator, value: "++" }, { type: TokenType.Operator, value: "--" })) {
      switch (reader.peek().value) {
        case "++":
          basic = IncrementOperatorNode.build(reader, basic);
          break;
        case "--":
          basic = DecrementOperatorNode.build(reader, basic);
          break;
      }
    }
  
    if (reader.nextIs({ type: TokenType.Operator }) && !reader.nextIs({ type: TokenType.Operator, value: "++" }, { type: TokenType.Operator, value: "--" })) {
      return MathOperationNode.build(reader, basic)
    }
  }

  while (reader.nextIs({ type: TokenType.Separator, value: "." }, { type: TokenType.Separator, value: "[" })) {
    if (reader.nextIs({ type: TokenType.Separator, value: "." })) {
      basic = PropertyReferenceNode.build(reader, basic);
    } else {
      basic = IndexReferenceNode.build(reader, basic);
    }
  }

  if (reader.nextIs({ type: TokenType.Separator, value: "=" })) {
    basic = VariableRedefinitionNode.build(reader, basic);
  }

  if (reader.nextIs({ type: TokenType.Comparison })) {
    basic = ComparisonOperationNode.build(reader, basic);
  }

  if (reader.nextIs({ type: TokenType.Separator, value: ";" })) reader.read();

  return basic;
}

export function readBasicValue(reader: LexReader): Exclude<ValueTreeNode, MathOperationNode> {
  if (reader.nextIs({ type: TokenType.Keyword, value: "function" })) {
    return MethodDefinitionNode.build(reader);
  }

  if (reader.nextIs({ type: TokenType.StringLiteral }, { type: TokenType.NumberLiteral }, { type: TokenType.BooleanLiteral })) {
    const next = reader.peek();

    switch (next.type) {
      case TokenType.BooleanLiteral:
        return BooleanLiteralNode.build(reader) as any;
      case TokenType.StringLiteral:
        return StringLiteralNode.build(reader) as any;
      case TokenType.NumberLiteral:
        return NumberLiteralNode.build(reader) as any;
    }
  }

  if (reader.nextIs({ type: TokenType.Identifier })) {
    let peek = reader.peek(1);

    if (peek && peek.type === TokenType.Separator && peek.value === "{") {
      return StructLiteralNode.build(reader);
    }

    return VariableReferenceNode.build(reader) as any;
  }

  if (reader.nextIs({ type: TokenType.Separator, value: "[" })) {
    return ArrayLiteralNode.build(reader);
  }

  throw new Error(`Failed to readBasicValue. Unexpected ${TokenType[reader.peek().type]}<${reader.peek().value}>`);
}
