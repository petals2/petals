import { Block } from "petals-stem/dist/src/block";
import { Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { MethodCallNode } from "../../../../../types/ast/nodes/methodCall";
import { Context } from "../../../context";
import { ListReference } from "../../../reference/list/abstract";
import { getVariableReference } from "../../../reference/variable";
import { VariableReference } from "../../../reference/variable/abstract";

export function callPush(list: ListReference, call: MethodCallNode, target: Target, thread: Block, context: Context): VariableReference {
  const arg = call.getArguments()[0];

  if (arg === undefined) throw new Error("Too few arguments to list.push. Requires 1 (the item to push)");

  list.push(Input.shadowed(getVariableReference(arg, context).getValue(target, thread, context)), target, thread, context);

  return {
    performSideEffects(target, thread, context) {},
    setValue(value, target, thread, context) { throw new Error("Cannot set the value of a list length reference"); },
    changeValue(value, target, thread, context) { throw new Error("Cannot change the value of a list length reference"); },
    getValue(target, thread, context) { return list.getLength(target, thread, context); },
  };
}


