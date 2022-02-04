import { StopOption } from "petals-stem/dist/src/block/category/control/stop";
import { Control } from "petals-stem/dist/src/block/category/control";
import { getVariableReference } from "../../reference/variable";
import { ReturnNode } from "../../../../types/ast/nodes/return";
import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { VariableReference } from "../../reference/variable/abstract";
import { getUnknownReference } from "../../reference";
import { ListReference } from "../../reference/list/abstract";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";

export default function (node: ReturnNode, target: Target, thread: Block, context: Context): void {
  const varToUpdate = context.getReturnVariable();

  if (varToUpdate === undefined) throw new Error("Cannot return from outside a function");

  const val = getUnknownReference(node.getValue(), context);

  if (varToUpdate instanceof VariableReference && !(val instanceof ListReference)) {
    varToUpdate.setValue(Input.shadowed(val.getValue(target, thread, context)), target, thread, context);
  } else if (varToUpdate instanceof ListReference && val instanceof ListReference) {
    if (val.isKnownContents()) {
      varToUpdate.deleteAll(target, thread, context);
      const contents = val.getContents(target, thread, context);
      for (let i = 0; i < contents.length; i++) {
        const content = contents[i];
        if (content instanceof ListReference) continue;
        varToUpdate.push(Input.shadowed(content), target, thread, context);
      }
    } else if (val.isKnownLength()) {
      varToUpdate.deleteAll(target, thread, context);
      const length = val.getKnownLength(context);
      for (let i = 0; i < length; i++) {
        const item = val.getItemAtIndex(Input.shadowed(new NumberInput(i)), target, thread, context)

        if (item instanceof ListReference) continue;

        varToUpdate.push(Input.shadowed(item), target, thread, context);
      }
    } else {
      varToUpdate.deleteAll(target, thread, context);
      const length = val.getLength(target, thread, context);
      const i = target.getVariables().createVariable("___temp_i", 0)
      const phantom = target.getBlocks().createBlock(Phantom);
      varToUpdate.push(Input.shadowed(val.getItemAtIndex(Input.shadowed(new VariableInput(i)), target, phantom, context) as AnyInput), target, phantom, context); 
      thread.getTail().append(target.getBlocks().createBlock(Control.ForEach, i, Input.shadowed(length), phantom.getHead()));
    }
  } else {
    throw new Error("Return type mismatch");
  }

  thread.getTail().append(target.getBlocks().createBlock(Control.Stop, StopOption.ThisScript));
}
