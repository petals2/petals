import { MethodDefinitionNode } from "../../../../types/ast/nodes/methodDefinition";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { NumberType } from "../../../../types/ast/type";
import { Variables } from "petals-stem/dist/src/block/category/variables";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { translateNodeListIntoBlock } from ".";
import { Control } from "petals-stem/dist/src/block/category/control";
import { Input } from "petals-stem/dist/src/block/input";
import { StringInput } from "petals-stem/dist/src/block/input/string";
import { methodIsRecursive } from "../../codeFlowAnalysis/methodIsRecursive";
import { getType } from "../../getType";
import { StructTool } from "../../structTool";
import { VariableReference } from "../../reference/variable/abstract";

export default function (node: MethodDefinitionNode, target: Target, thread: Block, context: Context): void {
  let isRecursive = methodIsRecursive(node);

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
    cursor = cursor.append(target.getBlocks().createBlock(Variables.ChangeVariableBy, functionIdxCount, 1));

    for (const variable of variablesDefinedInMethod) {
      const type = getType(variable, context);
      const size = StructTool.getSize(type);

      for (let i = 0; i < size; i++) {
        cursor = cursor.append(target.getBlocks().createBlock(Variables.AddToList, variable, ""));
      }
    }
  }

  cursor = cursor.append(head);

  const block = cursor.getTail();

  if (block instanceof Control.Stop) {
    target.getBlocks().removeBlock(block);
  } else {
    if (returnVariable instanceof VariableReference) {
      returnVariable.setValue(Input.shadowed(new StringInput("undefined")), target, block, context)
      return;
    }

    returnVariable.deleteAll(target, thread, context);
  }
}
