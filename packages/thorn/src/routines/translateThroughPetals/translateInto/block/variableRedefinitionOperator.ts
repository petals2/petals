import { VariableRedefinitionNode } from "../../../../types/ast/nodes/variableRedefinitionNode";
import { ListReference } from "../../reference/list/abstract";
import { getUnknownReference } from "../../reference";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { ValueTreeNode } from "../../../../types/ast/node";
import { VariableReference } from "../../reference/variable/abstract";
import { Input } from "petals-stem/dist/src/block/input";
import { getListReference } from "../../reference/list";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { ID } from "petals-stem/dist/src/id";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { Control } from "petals-stem/dist/src/block/category/control";
import { getVariableReference } from "../../reference/variable";
import { BooleanReference } from "../../reference/boolean/abstract";

export default function (node: VariableRedefinitionNode, target: Target, thread: Block, context: Context, redefining: boolean = true): void {
  const base = node.getBase();
  const newValue = node.getNewValue();

  const variableReference = getUnknownReference(base, context);

  if (variableReference instanceof BooleanReference) {
    throw new Error("Cannot redefine a boolean");
  }

  if (variableReference instanceof ListReference) {
    const valueRef = getListReference(newValue, context);

    valueRef.copyInto(variableReference, target, thread, context);
    return;
  }

  const reference = getUnknownReference(newValue, context);

  if (reference instanceof ListReference) throw new Error("attempted to assign a list value to a variable");

  variableReference.setValue(Input.shadowed(reference.getValue(target, thread, context)), target, thread, context)
}
