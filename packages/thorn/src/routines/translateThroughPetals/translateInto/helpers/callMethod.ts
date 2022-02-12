import { Block } from "petals-stem/dist/src/block";
import { Procedures } from "petals-stem/dist/src/block/category/procedures";
import { Input } from "petals-stem/dist/src/block/input";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { Target } from "petals-stem/dist/src/target";
import { MethodCallNode } from "../../../../types/ast/nodes/methodCall";
import { VariableReferenceNode } from "../../../../types/ast/nodes/variableReference";
import { TokenRange } from "../../../../types/token";
import { ListApi } from "../../api/list";
import { SelfApi } from "../../api/self";
import { Context } from "../../context";
import { getType } from "../../getType";
import { getUnknownReference } from "../../reference";
import { BooleanReference } from "../../reference/boolean/abstract";
import { getListReference } from "../../reference/list";
import { ListReference } from "../../reference/list/abstract";
import { VariableReference } from "../../reference/variable/abstract";
import { VariableHeapCopyReference } from "../../reference/variable/heapCopy";

export function call(node: MethodCallNode, target: Target, thread: Block, context: Context): VariableReference | ListReference | undefined {
  const base = node.getBaseValue();
  if (base.type !== "variableReference") {
    if (base.type === "propertyReference") {
      let parentType = getType(base.getParent(), context);
      
      if (parentType.isListType()) {
        const parent = getListReference(base.getParent(), target, thread, context);

        return ListApi.callListApi(parent, base.getProperty(), node, target, thread, context)
      }

      if (parentType.isSelfType()) {
        return SelfApi.callSelfApi(base.getProperty(), node, target, thread, context)
      }

      const parent = base.getParent();

      while (parentType.isReferenceType()) parentType = parentType.dereference();

      if (parentType.isClassType()) {
        const methods = context.getClass(parentType.getName())!.getMethods();

        if (methods[base.getProperty()] === undefined) {
          throw new Error("Class " + parentType.getName() + " does not have method " + base.getProperty());
        }

        const method = methods[base.getProperty()];

        if ((method.publicity === "private" || method.publicity === "protected") && context.getCurrentClass()?.getName() !== parentType.getName()) {
          throw new Error("Cannot access " + method.publicity + " method " + base.getProperty() + " outside of class");
        }

        const args = node.getArguments();

        args.unshift(base.getParent());

        return call(new MethodCallNode(new TokenRange(parent.getTokenRange().getStart(), TokenRange.fromNodes(args).getEnd()), new VariableReferenceNode(new TokenRange(base.getTokenRange()), "___" + parentType.getName() + "_" + base.getProperty()), args), target, thread, context);
      }
    }

    throw new Error("Method call base value must be a variable reference, got " + base.type);
  }

  const methodName = base.getName();

  if (methodName === "malloc") {
    const arg = getUnknownReference(node.getArguments()[0], target, thread, context);

    if (arg instanceof ListReference) throw new Error("Cannot pass lists into malloc");

    let call2 = target.getBlocks().createBlock(Procedures.Call, context.getHeap("global").malloc.getPrototype(), Input.shadowed(arg.getValue(target, thread, context)));

    thread.getTail().append(call2.getHead());

    return context.getHeap("global").mallocReturn;
  }

  const def = target.getBlocks().getCustomBlockByName(methodName);

  if (!def) throw new Error("Method " + methodName + " not found");

  const args = node.getArguments().map(arg => getUnknownReference(arg, target, thread, context));

  if (args.some(arg => arg instanceof ListReference)) throw new Error("Cannot pass lists into methods");

  let argValues = (args as (BooleanReference | VariableReference)[]).map(arg => Input.shadowed(arg.getValue(target, thread, context)));

  let call3 = target.getBlocks().createBlock(Procedures.Call, def.getPrototype(), ...argValues);

  args.forEach((v, i) => {
    if (v instanceof VariableHeapCopyReference) {
      const heap = v.getHeap();

      if (heap === undefined)
        throw new Error("Failed to free v? This should never happen, since arg.getValue is always called before this.");

      call3 = call3.getTail().append(target.getBlocks().createBlock(Procedures.Call, heap.free.getPrototype(), argValues[i]));
    }
  })

  const callIdxIndex = def.getPrototype().getArguments().findIndex(arg => arg.getName() === "___cidx");

  if (callIdxIndex !== -1) {
    const id = def.getPrototype().getArgumentIds()[callIdxIndex];

    (call3 as any).setInput(id, Input.shadowed(new VariableInput(target.getVariables().getVariableByName("___" + methodName + "_idx"))))
  }

  thread.getTail().append(call3.getHead());

  return context.getReturnVariableForMethod(methodName);
}
