import { Input, Target, Block, NumberInput, VariableInput, ID } from "petals-stem";
import { Procedures } from "petals-stem/dist/src/block/category";
import { AnyInput } from "petals-stem/dist/src/block/input";
import { getUnknownReference } from "..";
import { NewNode } from "../../../../types/ast/nodes/newNode";
import { ClassType, HeapReferenceType, NumberType } from "../../../../types/ast/type";
import { Context } from "../../context";
import { StructTool } from "../../structTool";
import { BooleanReference } from "../boolean/abstract";
import { ListReference } from "../list/abstract";
import { VariableReference } from "./abstract";
import { VariableHeapCopyReference } from "./heapCopy";

export class NewResultReference extends VariableReference {
  protected tempRes: VariableReference | undefined;

  constructor(
    protected readonly type: HeapReferenceType | ClassType,
    protected readonly newNode: NewNode,
  ) { super() }

  changeValue(value: Input, target: Target, thread: Block<string>, context: Context): Block<string> {
    throw new Error("Cannot change value of a new result");
  }

  setValue(value: Input, target: Target, thread: Block<string>, context: Context): Block<string> {
    throw new Error("Cannot change value of a new result");
  }

  performSideEffects(target: Target, thread: Block<string>, context: Context): void {
    // do the funny malloc
    thread.getTail().append(target.getBlocks().createBlock(Procedures.Call, context.getHeap(this.type.getHeapName()).malloc.getPrototype(), Input.shadowed(new NumberInput(StructTool.getSize(this.type.dereference())))));

    // store the funny malloc (in case we do another malloc before the call (for example, if you are creating a ref in the call ( &[] )))
    const temp = context.createVariable("___intermediate_" + ID.generate(), 0, new NumberType());
    temp.setValue(Input.shadowed(context.getHeap(this.type.getHeapName()).mallocReturn.getValue(target, thread, context)), target, thread, context);

    // do the funny method call
    const def = target.getBlocks().getCustomBlockByName("___" + this.newNode.getClass() + "_constructor");

    if (def) {
      const args = this.newNode.getArgs().map(arg => getUnknownReference(arg, target, thread, context));

      if (args.some(arg => args instanceof ListReference)) throw new Error("Cannot pass lists into methods");

      let argValues = (args as (BooleanReference | VariableReference)[]).map(arg => Input.shadowed(arg.getValue(target, thread, context)));

      argValues.unshift(Input.shadowed(temp.getValue(target, thread, context)));

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

        (call as any).setInput(id, Input.shadowed(new VariableInput(target.getVariables().getVariableByName("______" + this.newNode.getClass() + "_constructor_idx"))))
      }

      thread.getTail().append(call.getHead());
    }

    this.tempRes = temp;
  }

  getValue(target: Target, thread: Block<string>, context: Context): AnyInput {
    if (!this.tempRes) this.performSideEffects(target, thread, context);

    return this.tempRes!.getValue(target, thread, context);    
  }
}
