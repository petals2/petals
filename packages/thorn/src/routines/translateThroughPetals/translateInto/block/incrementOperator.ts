import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { getVariableReference } from "../../reference/variable";
import { Input } from "petals-stem/dist/src/block/input";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { IncrementOperatorNode } from "../../../../types/ast/nodes/incrementOperator";

export default function (node: IncrementOperatorNode, target: Target, thread: Block, context: Context): void {
  getVariableReference(node.getNode(), context)
    .changeValue(Input.shadowed(new NumberInput(1)), target, thread, context);
}
