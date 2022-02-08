import { Block } from "petals-stem/dist/src/block";
import { Procedures } from "petals-stem/dist/src/block/category/procedures";
import { Input } from "petals-stem/dist/src/block/input";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { Target } from "petals-stem/dist/src/target";
import { MethodCallNode } from "../../../../types/ast/nodes/methodCall";
import { ListApi } from "../../api/list";
import { Context } from "../../context";
import { getType } from "../../getType";
import { getUnknownReference } from "../../reference";
import { BooleanReference } from "../../reference/boolean/abstract";
import { getListReference } from "../../reference/list";
import { ListReference } from "../../reference/list/abstract";
import { VariableReference } from "../../reference/variable/abstract";
import { VariableHeapCopyReference } from "../../reference/variable/heapCopy";

export function call(node: MethodCallNode, target: Target, thread: Block, context: Context): VariableReference | ListReference {
  const base = node.getBaseValue();

  if (base.type !== "variableReference") {
    if (base.type === "propertyReference") {
      const parentType = getType(base.getParent(), context);

      if (parentType.isListType()) {
        const parent = getListReference(base.getParent(), target, thread, context);

        return ListApi.callListApi(parent, base.getProperty(), node, target, thread, context)
      }
    }

    throw new Error("Method call base value must be a variable reference, got " + base.type);
  }

  const methodName = base.getName();

  //TODO: reserved method names

  const def = target.getBlocks().getCustomBlockByName(methodName);

  if (!def) throw new Error("Method " + methodName + " not found");

  const args = node.getArguments().map(arg => getUnknownReference(arg, target, thread, context));

  if (args.some(arg => args instanceof ListReference)) throw new Error("Cannot pass lists into methods");

  let argValues = (args as (BooleanReference | VariableReference)[]).map(arg => Input.shadowed(arg.getValue(target, thread, context)));

  let call = target.getBlocks().createBlock(Procedures.Call, def.getPrototype(), ...argValues);

  args.forEach((v, i) => {
    if (v instanceof VariableHeapCopyReference) {
      const heap = v.getHeap();

      if (heap === undefined)
        throw new Error("Failed to free v? This should never happen, since arg.getValue is always called before this.");

      call = call.getTail().append(target.getBlocks().createBlock(Procedures.Call, heap.free.getPrototype(), argValues[i]));
    }
  })

  const callIdxIndex = def.getPrototype().getArguments().findIndex(arg => arg.getName() === "___cidx");

  if (callIdxIndex !== -1) {
    const id = def.getPrototype().getArgumentIds()[callIdxIndex];

    (call as any).setInput(id, Input.shadowed(new VariableInput(target.getVariables().getVariableByName("___" + methodName + "_idx"))))
  }

  thread.getTail().append(call.getHead());

  return context.getReturnVariableForMethod(methodName);
}
