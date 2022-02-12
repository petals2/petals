import { Block, Target } from "petals-stem";

import { MethodCallNode } from "../../../../types/ast/nodes/methodCall";
import { Context } from "../../context";
import { call } from "../helpers/callMethod";

export default function (node: MethodCallNode, target: Target, thread: Block, context: Context): void {
  call(node, target, thread, context);
}