import { Block } from "petals-stem";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { TreeNode } from "../ast/node";
import { FunctionDefinitionNode } from "../ast/node/functionDefinition";
import { VariableDefinitionNode } from "../ast/node/variableDefinition";
import { ThornFunctionRefrence } from "../refrences/thorn/function";
import { ThornVariableRefrence } from "../refrences/thorn/variable";
import { getType } from "../type";
import { TranslationContext } from "./context";
import { translateNode } from "./node";

export function translateStack(tree: TreeNode[], context: TranslationContext): Block {
  context.enterContext(new Map());
  tree.forEach(node => {
    if (node instanceof FunctionDefinitionNode) {
      const functionDefinitionNode = node as FunctionDefinitionNode;

      context.setIdentifier(functionDefinitionNode.getName(), new ThornFunctionRefrence(functionDefinitionNode, context.getTarget(), context));
    }

    if (node instanceof VariableDefinitionNode) {
      const variableDefinitionNode = node as VariableDefinitionNode;
      
      context.setIdentifier(variableDefinitionNode.getVariableName().getIdentifier(), new ThornVariableRefrence(variableDefinitionNode, context.getTarget(), node.getType() ?? getType(node.getValue(), context)));
    }
  })

  let head = context.getTarget().getBlocks().createBlock(Phantom);

  for (const item of tree) {
    head = head.append(translateNode(item, context).getHead()).getTail();
  }

  context.exitContext();

  return head.getHead();
}
