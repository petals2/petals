import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { TreeNode } from "../../../../types/ast/node";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";

import translateVariableRedefinitionOperator from "./variableRedefinitionOperator";
import translateMethodDefinitionNode from "./methodDefinitionNode";
import translateComparisonOperator from "./comparisonOperator";
import translateHeapDefinitionNode from "./heapDefinitionNode";
import translateVariableDefinition from "./variableDefinition";
import translateIncrementOperator from "./incrementOperator";
import translateDecrementOperator from "./decrementOperator";
import translateStructDefinition from "./structDefinition";
import translateMethodCallNode from "./methodCall";
import translateMathOperator from "./mathOperator";
import translateReturnBlock from "./returnBlock";
import translateClassBlock from "./classBlock";
import translateWhileBlock from "./whileBlock";
import translateFreeBlock from "./freeBlock";
import translateForBlock from "./forBlock";
import translateIfBlock from "./ifBlock";
import { getVariableReference } from "../../reference/variable";
import { TransformError } from "../../../../errors/transformError";

export function translateNodeListIntoBlock(node: TreeNode[], target: Target, ctx: Context): Block {
  ctx.enter();

  const v = node.reduce((block, node) => {
    return block.append(translateNodeIntoBlock(node, target, ctx)).getTail();
  }, target.getBlocks().createBlock(Phantom));

  ctx.exit();

  return v.getHead();
}

export function translateNodeIntoBlock(node: TreeNode, target: Target, ctx: Context): Block {
  const thread = target.getBlocks().createBlock(Phantom);

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
    }
  }
  
  return thread;

  throw new Error("Cannot translate node into block: " + node.type);
}
