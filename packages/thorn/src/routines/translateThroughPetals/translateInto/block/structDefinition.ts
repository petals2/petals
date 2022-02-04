import { StructDefinitionNode } from "../../../../types/ast/nodes/structDefinitionNode";
import { Context, typeApplyContext } from "../../context";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";

export default function (node: StructDefinitionNode, target: Target, thread: Block, ctx: Context): void {
  typeApplyContext(node.getStructure(), ctx);

  ctx.defineStruct(node.getName(), node.getStructure());
}
