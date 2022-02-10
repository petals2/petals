import { StructDefinitionNode } from "../../../../types/ast/nodes/structDefinitionNode";
import { Context, typeApplyContext } from "../../context";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { ClassDefinitionNode } from "../../../../types/ast/nodes/classDefinitionNode";
import { NumberType, StructureType } from "../../../../types/ast/type";
import translateMethodDefinitionNode from "./methodDefinitionNode";
import { MethodDefinitionNode } from "../../../../types/ast/nodes/methodDefinition";

export default function (node: ClassDefinitionNode, target: Target, thread: Block, ctx: Context): void {
  ctx.enterClass(node);

  const struct = new StructureType(node.getName(), new Map(Object.entries(node.getFields()).map(e => [e[0], e[1].type])));

  typeApplyContext(struct, ctx);

  ctx.defineStruct("___" + node.getName() + "_struct", struct);

  Object.entries(node.getMethods()).forEach(([name, info]) => {
    translateMethodDefinitionNode(new MethodDefinitionNode("___" + node.getName() + "_" + name, info.method.getReturnType(), [{ name: "___this_arg", type: new NumberType() }, ...info.method.getArguments()], info.method.getContents()), target, thread, ctx);
  });

  const ctor = node.getConstructor();

  if (ctor) {
    translateMethodDefinitionNode(new MethodDefinitionNode("___" + node.getName() + "_constructor", ctor.method.getReturnType(), [{ name: "___this_arg", type: new NumberType() }, ...ctor.method.getArguments()], ctor.method.getContents()), target, thread, ctx);
  }

  ctx.exitClass();
}
