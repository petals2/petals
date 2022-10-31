import { Token, TokenRange } from "../../lexer/token";
import { ArrayLiteralNode } from "./arrayLiteral";
import { ArrowFunctionNode } from "./arrowFunction";
import { ComparisonNode } from "./comparison";
import { DecrementNode } from "./decrement";
import { ForNode } from "./for";
import { FunctionCallNode } from "./functionCall";
import { FunctionDefinitionNode } from "./functionDefinition";
import { IdentifierNode } from "./identifier";
import type { IfNode } from "./if";
import { ImportNode } from "./import";
import { IncrementNode } from "./increment";
import { IndexReferenceNode } from "./indexReference";
import type { LiteralNode } from "./literal";
import { MathOperationNode } from "./mathOperation";
import { ParenthesizedExpressionNode } from "./parenthesizedExpression";
import { PropertyReferenceNode } from "./propertyReference";
import { ReturnNode } from "./return";
import type { VariableDefinitionNode } from "./variableDefinition";
import { VariableRedefinitionNode } from "./variableRedefinition";
import { WhileNode } from "./while";

export abstract class Node {
  constructor(protected readonly tokenRange: TokenRange) {}

  getTokenRange() {
    return this.tokenRange;
  }
}

export type TreeNode = ImportNode | ReturnNode | FunctionDefinitionNode | VariableDefinitionNode | IfNode | ValueNode | WhileNode | ForNode;
export type ValueNode = ArrowFunctionNode | FunctionCallNode | LiteralNode | ComparisonNode | IdentifierNode | IncrementNode | DecrementNode | MathOperationNode | PropertyReferenceNode | IndexReferenceNode | ParenthesizedExpressionNode | ArrayLiteralNode | VariableRedefinitionNode;
