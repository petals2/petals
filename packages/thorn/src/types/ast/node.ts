import { ArrayLiteralNode } from "./nodes/arrayLiteral";
import { BooleanLiteralNode } from "./nodes/booleanLiteral";
import { ClassDefinitionNode } from "./nodes/classDefinitionNode";
import { ComparisonOperationNode } from "./nodes/comparisonOperation";
import { DecrementOperatorNode } from "./nodes/decrementOperator";
import { ForNode } from "./nodes/forNode";
import { FreeNode } from "./nodes/freeNode";
import { HeapDefinitionNode } from "./nodes/heapDefinitionNode";
import { ifBlockNode } from "./nodes/ifBlock";
import { IncrementOperatorNode } from "./nodes/incrementOperator";
import { IndexReferenceNode } from "./nodes/indexReference";
import { MathOperationNode } from "./nodes/mathOperation";
import { MethodCallNode } from "./nodes/methodCall";
import { MethodDefinitionNode } from "./nodes/methodDefinition";
import { NegateOperator } from "./nodes/negateOperator";
import { NewNode } from "./nodes/newNode";
import { NumberLiteralNode } from "./nodes/numberLiteral";
import { ParenthesisedExpressionNode } from "./nodes/parenthesisedExpression";
import { PropertyReferenceNode } from "./nodes/propertyReference";
import { ReturnNode } from "./nodes/return";
import { SelfReferenceNode } from "./nodes/selfReferenceNode";
import { HeapCopyOperation } from "./nodes/stackCopyOperation";
import { StringLiteralNode } from "./nodes/stringLiteral";
import { StructDefinitionNode } from "./nodes/structDefinitionNode";
import { StructLiteralNode } from "./nodes/structLiteral";
import { ThisNode } from "./nodes/thisNode";
import { VariableDefinitionNode } from "./nodes/variableDefinition";
import { VariableRedefinitionNode } from "./nodes/variableRedefinitionNode";
import { VariableReferenceNode } from "./nodes/variableReference";
import { WhileNode } from "./nodes/while";

export type GetTreeNode<NodeType extends string> = TreeNode extends { type: NodeType } ? TreeNode : never;

export type ValueTreeNode = ThisNode
  | NewNode
  | IndexReferenceNode
  | HeapCopyOperation
  | StructLiteralNode
  | NumberLiteralNode
  | BooleanLiteralNode
  | StringLiteralNode
  | ArrayLiteralNode
  | VariableRedefinitionNode
  | NegateOperator
  | VariableReferenceNode
  | MathOperationNode
  | SelfReferenceNode
  | MethodCallNode
  | PropertyReferenceNode
  | ParenthesisedExpressionNode
  | ComparisonOperationNode
  | MethodDefinitionNode
  | IncrementOperatorNode
  | DecrementOperatorNode;

export type TreeNode = VariableDefinitionNode
  | ParenthesisedExpressionNode
  | VariableRedefinitionNode
  | ComparisonOperationNode
  | PropertyReferenceNode
  | VariableReferenceNode
  | IncrementOperatorNode
  | DecrementOperatorNode
  | StructDefinitionNode
  | MethodDefinitionNode
  | ClassDefinitionNode
  | IndexReferenceNode
  | BooleanLiteralNode
  | HeapDefinitionNode
  | HeapCopyOperation
  | StructLiteralNode
  | NumberLiteralNode
  | StringLiteralNode
  | MathOperationNode
  | SelfReferenceNode
  | ArrayLiteralNode
  | NegateOperator
  | MethodCallNode
  | ifBlockNode
  | ReturnNode
  | WhileNode
  | ThisNode
  | FreeNode
  | ForNode
  | NewNode
