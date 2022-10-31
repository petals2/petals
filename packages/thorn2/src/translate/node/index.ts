import { Block } from "petals-stem";
import { TreeNode } from "../../ast/node";
import { DecrementNode } from "../../ast/node/decrement";
import { ForNode } from "../../ast/node/for";
import { IfNode } from "../../ast/node/if";
import { IncrementNode } from "../../ast/node/increment";
import { VariableDefinitionNode } from "../../ast/node/variableDefinition";
import { VariableRedefinitionNode } from "../../ast/node/variableRedefinition";
import { WhileNode } from "../../ast/node/while";
import { TranslationContext } from "../context";
import { translateDecrementBlock } from "./decrement";
import { translateForIntoBlock } from "./for";
import { translateIfIntoBlock } from "./if";
import { translateIncrementBlock } from "./increment";
import { translateVariableDefinitionIntoBlock } from "./variableDefinition";
import { translateVariableRedefinitionIntoBlock } from "./variableRedefinition";
import { translateWhileIntoBlock } from "./while";

export function translateNode(node: TreeNode, context: TranslationContext): Block {
  if (node instanceof VariableRedefinitionNode) return translateVariableRedefinitionIntoBlock(node, context);
  if (node instanceof VariableDefinitionNode) return translateVariableDefinitionIntoBlock(node, context);
  if (node instanceof DecrementNode) return translateDecrementBlock(node, context);
  if (node instanceof IncrementNode) return translateIncrementBlock(node, context);
  if (node instanceof WhileNode) return translateWhileIntoBlock(node, context);
  if (node instanceof ForNode) return translateForIntoBlock(node, context);
  if (node instanceof IfNode) return translateIfIntoBlock(node, context);

  throw new Error(`No implementation to translate ${node.constructor.name}`);
}
