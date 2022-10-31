import { Block, Input, NumberInput, Target } from "petals-stem";

import { DecrementOperatorNode } from "../../../../types/ast/nodes/decrementOperator";
import { Context } from "../../context";
import { getVariableReference } from "../../reference/variable";

export default function (node: DecrementOperatorNode, target: Target, thread: Block, context: Context): void {
  getVariableReference(node.getNode(), target, thread, context)
    .changeValue(Input.shadowed(new NumberInput(-1)), target, thread, context);
}