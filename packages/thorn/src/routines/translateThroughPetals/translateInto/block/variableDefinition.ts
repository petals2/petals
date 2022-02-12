import { VariableDefinitionNode } from "../../../../types/ast/nodes/variableDefinition";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { getType } from "../../getType";

import { VariableRedefinitionNode } from "../../../../types/ast/nodes/variableRedefinitionNode";
import { VariableReferenceNode } from "../../../../types/ast/nodes/variableReference";
import translateVariableRedefinitionNode from "./variableRedefinitionOperator";
import { TokenRange } from "../../../../types/token";

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

  if (type.isListType() || type.isStructureType()) {
    context.createList(node.getName(), [], type);
  } else {
    context.createVariable(node.getName(), 0, type);
  }

  if (node.getInitialValue() !== undefined) {
    translateVariableRedefinitionNode(new VariableRedefinitionNode(new TokenRange(node.getTokenRange()), new VariableReferenceNode(new TokenRange(node.getTokenRange()), node.getName()), node.getInitialValue()!), target, thread, context, context.isInRecursiveMethod());
  }
}
