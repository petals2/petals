import { MethodDefinitionNode } from "../../../types/ast/nodes/methodDefinition";
import { Context } from "../context";
import { getReferencedMethods } from "./getReferencedMethods";

export function methodIsRecursive(method: MethodDefinitionNode, context: Context): boolean {
  const calls = getReferencedMethods(context, ...method.getContents());

  if (calls.length === 0) {
    return false;
  }

  if (calls.includes(method.getName())) {
    return true;
  }

  // now the hard part.

  throw new Error("TODO");
}
