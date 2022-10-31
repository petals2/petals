import { Block, Target } from "petals-stem";

import { VariableDefinitionNode } from "../../../../types/ast/nodes/variableDefinition";
import { VariableRedefinitionNode } from "../../../../types/ast/nodes/variableRedefinitionNode";
import { VariableReferenceNode } from "../../../../types/ast/nodes/variableReference";
import { Type } from "../../../../types/ast/type";
import { TokenRange } from "../../../../types/token";
import { Context } from "../../context";
import { getType } from "../../getType";
import translateVariableRedefinitionNode from "./variableRedefinitionOperator";

function shouldCreateList(t: Type, context: Context): boolean {
  while (t.isReferenceType()) {
    t.loadIntoContext(context);
    t = t.dereference();
  }

  if (t.isListType() || t.isStructureType()) return true;

  if (t.isUnionType()) {
    return t.getTypes().some(t => shouldCreateList(t, context));
  }

  return false;
}

export default function (node: VariableDefinitionNode, target: Target, thread: Block, context: Context): void {
  let type = node.getType();

  if (type === undefined) {
    const iv = node.getInitialValue();

    if (iv === undefined) throw new Error("Cannot create variable without type or initial value");

    type = getType(iv, context);
  }

  while (type.isReferenceType()) {
    type.loadIntoContext(context);
    type = type.dereference();
  }

  if (shouldCreateList(type, context)) {
    context.createList(node.getName(), [], type);
  } else {
    context.createVariable(node.getName(), 0, type);
  }

  if (node.getInitialValue() !== undefined) {
    translateVariableRedefinitionNode(new VariableRedefinitionNode(new TokenRange(node.getTokenRange()), new VariableReferenceNode(new TokenRange(node.getTokenRange()), node.getName()), node.getInitialValue()!), target, thread, context, context.isInRecursiveMethod());
  }
}