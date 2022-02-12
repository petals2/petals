import { Block, Target } from "petals-stem";

import { StructDefinitionNode } from "../../../../types/ast/nodes/structDefinitionNode";
import { Context, typeApplyContext } from "../../context";

export default function (node: StructDefinitionNode, target: Target, thread: Block, ctx: Context): void {
  typeApplyContext(node.getStructure(), ctx);

  ctx.defineStruct(node.getName(), node.getStructure());
}