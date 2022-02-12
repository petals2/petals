import { Block, Blocks, Input, NumberInput, Target } from "petals-stem";

import { VariableAdditionRedefinitionNode } from "../../../../types/ast/nodes/variableAdditionRedefinition";
import { VariableDivisionRedefinitionNode } from "../../../../types/ast/nodes/variableDivisionRedefinition";
import { VariableMultiplicationRedefinitionNode } from "../../../../types/ast/nodes/variableMultiplicationRedefinition";
import { VariableRedefinitionNode } from "../../../../types/ast/nodes/variableRedefinitionNode";
import { VariableSubtractionRedefinitionNode } from "../../../../types/ast/nodes/variableSubtractionRedefinition";
import { Context } from "../../context";
import { getUnknownReference } from "../../reference";
import { BooleanReference } from "../../reference/boolean/abstract";
import { getListReference } from "../../reference/list";
import { ListReference } from "../../reference/list/abstract";

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
    variableReference.changeValue(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Subtract, Input.shadowed(new NumberInput(0)), Input.shadowed(reference.getValue(target, thread, context)))), target, thread, context);
    return;
  }

  if (node instanceof VariableMultiplicationRedefinitionNode || node instanceof VariableDivisionRedefinitionNode) {
    variableReference.setValue(Input.shadowed(target.getBlocks().createBlock(node instanceof VariableMultiplicationRedefinitionNode ? Blocks.Operators.Multiply : Blocks.Operators.Divide, Input.shadowed(variableReference.getValue(target, thread, context)), Input.shadowed(reference.getValue(target, thread, context)))), target, thread, context)
    return;
  }

  variableReference.setValue(Input.shadowed(reference.getValue(target, thread, context)), target, thread, context)
}