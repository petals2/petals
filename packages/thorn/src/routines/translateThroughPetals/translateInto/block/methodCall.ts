import { MethodCallNode } from "../../../../types/ast/nodes/methodCall";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { MethodCallResultReference } from "../../reference/variable/methodCall";
import { call } from "../helpers/callMethod";

export default function (node: MethodCallNode, target: Target, thread: Block, context: Context): void {
  call(node, target, thread, context);
}
