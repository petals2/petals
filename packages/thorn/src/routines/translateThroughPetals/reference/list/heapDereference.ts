import { Input, Target, Block, NumberInput } from "petals-stem";
import { Operators } from "petals-stem/dist/src/block/category";
import { AnyInput } from "petals-stem/dist/src/block/input";
import { HeapReferenceType, Type } from "../../../../types/ast/type";
import { Context } from "../../context";
import { VariableReference } from "../variable/abstract";
import { ListReference } from "./abstract";

export class HeapDereference extends ListReference {
  constructor(
    protected baseInstance: VariableReference,
    protected readonly path: string[],
    protected parentType: HeapReferenceType
  ) {
    super();
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO");
  }

  copyInto(list: ListReference, target: Target, thread: Block, context: Context, redefining?: boolean): void {
    throw new Error("TODO");
  }

  deleteAll(target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO");
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): ListReference | AnyInput {
    const heap = context.getHeap(this.parentType.getHeapName());

    const v0 = heap.heapIndexes.getItemAtIndex(Input.shadowed(this.baseInstance.getValue(target, thread, context)), target, thread, context);

    if (v0 instanceof ListReference) throw new Error("PANIC! HeapIndexes itemAtIndex returned a ListReference");

    const v = heap.heap.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Operators.Add, Input.shadowed(v0), index)), target, thread, context)

    if (v instanceof ListReference) throw new Error("PANIC! VariableHeapDereference actually points to a ListReference");

    return v;
  }

  getLength(target: Target, thread: Block, context: Context): AnyInput {
    const heap = context.getHeap(this.parentType.getHeapName());

    const v0 = heap.heapIndexes.getItemAtIndex(Input.shadowed(this.baseInstance.getValue(target, thread, context)), target, thread, context);

    if (v0 instanceof ListReference) throw new Error("PANIC! HeapIndexes itemAtIndex returned a ListReference");

    const v = heap.heap.getItemAtIndex(Input.shadowed(v0), target, thread, context)

    if (v instanceof ListReference) throw new Error("PANIC! VariableHeapDereference actually points to a ListReference");

    return v;
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }

  push(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }

  getContentType(context: Context): Type {
    throw new Error("TODO");
  }
}
