import { StructDefinitionNode } from "../../../../types/ast/nodes/structDefinitionNode";
import { Context, typeApplyContext } from "../../context";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { ClassDefinitionNode } from "../../../../types/ast/nodes/classDefinitionNode";
import { ClassType, MethodType, NumberType, StructureType } from "../../../../types/ast/type";
import translateMethodDefinitionNode from "./methodDefinitionNode";
import { MethodDefinitionNode } from "../../../../types/ast/nodes/methodDefinition";
import { TokenRange } from "../../../../types/token";

export default function (node: ClassDefinitionNode, target: Target, thread: Block, ctx: Context): void {
  const struct = new StructureType(new Map(Object.entries(node.getFields()).map(e => [e[0], e[1].type])));

  typeApplyContext(struct, ctx);

  const methodType: Record<string, {
    publicity: "public" | "protected" | "private";
    method: MethodType;
  }> = {}

  for (const [key, value] of Object.entries(node.getMethods())) {
    methodType[key] = { publicity: value.publicity, method: new MethodType(value.method.getArguments().map(a => [a.name, a.type]), value.method.getReturnType()) }
  }

  const type = new ClassType(
    struct, 
    methodType,
    node.getName(),
    node.getConstructor() ? { publicity: node.getConstructor()!.publicity, method: new MethodType(node.getConstructor()!.method.getArguments().map(a => [a.name, a.type]), node.getConstructor()!.method.getReturnType()) } : undefined,
  );

  ctx.enterClass(type);

  Object.entries(node.getMethods()).forEach(([name, info]) => {
    translateMethodDefinitionNode(new MethodDefinitionNode(new TokenRange(node.getTokenRange()), "___" + node.getName() + "_" + name, info.method.getReturnType(), [{ name: "___this_arg", type: new NumberType() }, ...info.method.getArguments()], info.method.getContents()), target, thread, ctx);
  });

  const ctor = node.getConstructor();

  if (ctor) {
    translateMethodDefinitionNode(new MethodDefinitionNode(new TokenRange(node.getTokenRange()), "___" + node.getName() + "_constructor", ctor.method.getReturnType(), [{ name: "___this_arg", type: new NumberType() }, ...ctor.method.getArguments()], ctor.method.getContents()), target, thread, ctx);
  }

  ctx.exitClass();
}
