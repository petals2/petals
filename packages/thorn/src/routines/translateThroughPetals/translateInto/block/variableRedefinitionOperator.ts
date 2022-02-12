import { VariableRedefinitionNode } from "../../../../types/ast/nodes/variableRedefinitionNode";
import { ListReference } from "../../reference/list/abstract";
import { getUnknownReference } from "../../reference";
import { Target } from "petals-stem/dist/src/target";
import { Block, Operators } from "petals-stem/dist/src/block";
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
import { VariableAdditionRedefinitionNode } from "../../../../types/ast/nodes/variableAdditionRedefinition";
import { VariableSubtractionRedefinitionNode } from "../../../../types/ast/nodes/variableSubtractionRedefinition";
import { VariableMultiplicationRedefinitionNode } from "../../../../types/ast/nodes/variableMultiplicationRedefinition";
import { VariableDivisionRedefinitionNode } from "../../../../types/ast/nodes/variableDivisionRedefinition";

export default function (node: VariableRedefinitionNode | VariableAdditionRedefinitionNode | VariableSubtractionRedefinitionNode | VariableMultiplicationRedefinitionNode | VariableDivisionRedefinitionNode, target: Target, thread: Block, context: Context, redefining: boolean = true): void {
  const base = node.getBase();
  const newValue = node.getNewValue();

  const variableReference = getUnknownReference(base, target, thread, context);

  if (variableReference instanceof BooleanReference) {
    throw new Error("Cannot redefine a boolean");
  }

  if (variableReference instanceof ListReference) {
    const valueRef = getListReference(newValue, target, thread, context);

    valueRef.copyInto(variableReference, target, thread, context);
    return;
  }

  const reference = getUnknownReference(newValue, target, thread, context);

  if (reference instanceof ListReference) throw new Error("attempted to assign a list value to a variable");

  if (node instanceof VariableAdditionRedefinitionNode) {
    variableReference.changeValue(Input.shadowed(reference.getValue(target, thread, context)), target, thread, context);
    return;
  }

  if (node instanceof VariableSubtractionRedefinitionNode) {
    variableReference.changeValue(Input.shadowed(target.getBlocks().createBlock(Operators.Subtract, Input.shadowed(new NumberInput(0)), Input.shadowed(reference.getValue(target, thread, context)))), target, thread, context);
    return;
  }

  if (node instanceof VariableMultiplicationRedefinitionNode || node instanceof VariableDivisionRedefinitionNode) {
    variableReference.setValue(Input.shadowed(target.getBlocks().createBlock(node instanceof VariableMultiplicationRedefinitionNode ? Operators.Multiply : Operators.Divide, Input.shadowed(variableReference.getValue(target, thread, context)), Input.shadowed(reference.getValue(target, thread, context)))), target, thread, context)
    return;
  }

  variableReference.setValue(Input.shadowed(reference.getValue(target, thread, context)), target, thread, context)
}
