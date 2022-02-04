import { MethodDefinitionNode } from "../../../types/ast/nodes/methodDefinition";
import { getReferencedMethods } from "./getReferencedMethods";
import { Target } from "petals-stem/dist/src/target";

export function methodIsRecursive(method: MethodDefinitionNode): boolean {
  const calls = getReferencedMethods(...method.getContents());

  if (calls.length === 0) {
    return false;
  }

  if (calls.includes(method.getName())) {
    return true;
  }

  // now the hard part.

  throw new Error("TODO");
}
