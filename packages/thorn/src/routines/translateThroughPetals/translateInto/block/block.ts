import { Block, Blocks, Target } from "petals-stem";

import { TransformError } from "../../../../errors/transformError";
import { TreeNode } from "../../../../types/ast/node";
import { Context } from "../../context";
import { getVariableReference } from "../../reference/variable";
import translateClassBlock from "./classBlock";
import translateComparisonOperator from "./comparisonOperator";
import translateDecrementOperator from "./decrementOperator";
import translateForBlock from "./forBlock";
import translateFreeBlock from "./freeBlock";
import translateHeapDefinitionNode from "./heapDefinitionNode";
import translateIfBlock from "./ifBlock";
import translateIncrementOperator from "./incrementOperator";
import translateMathOperator from "./mathOperator";
import translateMethodCallNode from "./methodCall";
import translateMethodDefinitionNode from "./methodDefinitionNode";
import translateReturnBlock from "./returnBlock";
import translateStructDefinition from "./structDefinition";
import translateVariableDefinition from "./variableDefinition";
import translateVariableRedefinitionOperator from "./variableRedefinitionOperator";
import translateWhileBlock from "./whileBlock";

export function translateNodeListIntoBlock(node: TreeNode[], target: Target, ctx: Context): Block {
  ctx.enter();

  const v = node.reduce((block, node) => {
    return block.append(translateNodeIntoBlock(node, target, ctx)).getTail();
  }, target.getBlocks().createBlock(Blocks.Phantom));

  ctx.exit();

  return v.getHead();
}

export function translateNodeIntoBlock(node: TreeNode, target: Target, ctx: Context): Block {
  const thread = target.getBlocks().createBlock(Blocks.Phantom);

  try {
    switch(node.type) {
      case "variableRedefinition": translateVariableRedefinitionOperator(node, target, thread, ctx); return thread;
      case "comparisonOperation": translateComparisonOperator(node, target, thread, ctx); return thread;
      case "variableDefinition": translateVariableDefinition(node, target, thread, ctx); return thread;
      case "structDefinitionNode": translateStructDefinition(node, target, thread, ctx); return thread;
      case "heapDefinitionNode": translateHeapDefinitionNode(node, target, thread, ctx); return thread;
      case "methodDefinition": translateMethodDefinitionNode(node, target, thread, ctx); return thread;
      case "incrementOperator": translateIncrementOperator(node, target, thread, ctx); return thread;
      case "decrementOperator": translateDecrementOperator(node, target, thread, ctx); return thread;
      case "classDefinitionNode": translateClassBlock(node, target, thread, ctx); return thread;
      case "mathOperation": translateMathOperator(node, target, thread, ctx); return thread;
      case "methodCall": translateMethodCallNode(node, target, thread, ctx); return thread;
      case "return": translateReturnBlock(node, target, thread, ctx); return thread;
      case "while": translateWhileBlock(node, target, thread, ctx); return thread;
      case "forNode": translateForBlock(node, target, thread, ctx); return thread;
      case "ifBlock": translateIfBlock(node, target, thread, ctx); return thread;
      case "free": translateFreeBlock(node, target, thread, ctx); return thread;
      case "new": 
        getVariableReference(node, target, thread, ctx).performSideEffects(target, thread, ctx);
        return thread;
    }
  } catch (e) {
    if (e instanceof TransformError) {
      ctx.pushTransformError(e);
    } else {
      throw e;
    }
  }
  
  return thread;

  throw new Error("Cannot translate node into block: " + node.type);
}