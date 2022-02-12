import { Block, Input, NumberInput, Target } from "petals-stem";

import { IncrementOperatorNode } from "../../../../types/ast/nodes/incrementOperator";
import { Context } from "../../context";
import { getVariableReference } from "../../reference/variable";

export default function (node: IncrementOperatorNode, target: Target, thread: Block, context: Context): void {
  getVariableReference(node.getNode(), target, thread, context)
    .changeValue(Input.shadowed(new NumberInput(1)), target, thread, context);
}