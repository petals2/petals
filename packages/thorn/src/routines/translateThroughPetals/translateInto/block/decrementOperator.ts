import { DecrementOperatorNode } from "../../../../types/ast/nodes/decrementOperator";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { getVariableReference } from "../../reference/variable";
import { Input } from "petals-stem/dist/src/block/input";
import { NumberInput } from "petals-stem/dist/src/block/input/number";

export default function (node: DecrementOperatorNode, target: Target, thread: Block, context: Context): void {
  getVariableReference(node.getNode(), target, thread, context)
    .changeValue(Input.shadowed(new NumberInput(-1)), target, thread, context);
}
