import { Block, Blocks, Input, StringInput, Target } from "petals-stem";

import { translateNodeListIntoBlock } from ".";
import { MethodDefinitionNode } from "../../../../types/ast/nodes/methodDefinition";
import { NumberType } from "../../../../types/ast/type";
import { methodIsRecursive } from "../../codeFlowAnalysis/methodIsRecursive";
import { Context } from "../../context";
import { getType } from "../../getType";
import { VariableReference } from "../../reference/variable/abstract";
import { StructTool } from "../../structTool";

export default function (node: MethodDefinitionNode, target: Target, thread: Block, context: Context): void {
  let isRecursive = methodIsRecursive(node, context);

  const args = node.getArguments()
    .map(argument => (<const>{
      type: "string",
      name: argument.name,
      defaultValue: "",
    }));

  const functionIdxCount = target.getVariables().createVariable("___" + node.getName() + "_idx", 0);

  console.log(functionIdxCount);

  context.setType(functionIdxCount, new NumberType());

  if (isRecursive)
    args.push({ type: "string", name: "___cidx", defaultValue: "" });

  let cursor: Block = target.getBlocks().createCustomBlockHat(node.getName(), args);

  context.setType(node.getName(), node.getReturnType());
  context.enterMethod(node.getName(), node.getArguments(), node.getReturnType(), isRecursive);

  const head = translateNodeListIntoBlock(node.getContents(), target, context);

  const returnVariable = context.getReturnVariable()!;
  const variablesDefinedInMethod = context.exitMethod();

  if (isRecursive) {
    cursor = cursor.append(target.getBlocks().createBlock(Blocks.Variables.ChangeVariableBy, functionIdxCount, 1));

    for (const variable of variablesDefinedInMethod) {
      const type = getType(variable, context);
      const size = StructTool.getSize(type);

      for (let i = 0; i < size; i++) {
        cursor = cursor.append(target.getBlocks().createBlock(Blocks.Variables.AddToList, variable, ""));
      }
    }
  }

  cursor = cursor.append(head);

  const block = cursor.getTail();

  if (block instanceof Blocks.Control.Stop) {
    target.getBlocks().removeBlock(block);
  } else {
    if (returnVariable instanceof VariableReference) {
      returnVariable.setValue(Input.shadowed(new StringInput("undefined")), target, block, context)
      return;
    }

    returnVariable.deleteAll(target, thread, context);
  }
}