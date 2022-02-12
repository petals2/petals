import { AnyInput, Block, Blocks, Input, Target } from "petals-stem";

import { ClassType, HeapReferenceType, Type } from "../../../../types/ast/type";
import { Context } from "../../context";
import { ListReference } from "./abstract";

export class ThisDereference extends ListReference {
  constructor(protected readonly parentType: HeapReferenceType | ClassType) {
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

    const v0 = heap.heapIndexes.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___this_arg")), target, thread, context);

    if (v0 instanceof ListReference) throw new Error("PANIC! HeapIndexes itemAtIndex returned a ListReference");

    const v = heap.heap.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, Input.shadowed(v0), index)), target, thread, context)

    if (v instanceof ListReference) throw new Error("PANIC! VariableHeapDereference actually points to a ListReference");

    return v;
  }

  getLength(target: Target, thread: Block, context: Context): AnyInput {
    const heap = context.getHeap(this.parentType.getHeapName());

    const v0 = heap.heapIndexes.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___this_arg")), target, thread, context);

    if (v0 instanceof ListReference) throw new Error("PANIC! HeapIndexes itemAtIndex returned a ListReference");

    const v = heap.heap.getItemAtIndex(Input.shadowed(v0), target, thread, context)

    if (v instanceof ListReference) throw new Error("PANIC! VariableHeapDereference actually points to a ListReference");

    return v;
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    const heap = context.getHeap(this.parentType.getHeapName());

    const v0 = heap.heapIndexes.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___this_arg")), target, thread, context);

    if (v0 instanceof ListReference) throw new Error("PANIC! HeapIndexes itemAtIndex returned a ListReference");

    return heap.heap.overwriteAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, Input.shadowed(v0), index)), value, target, thread, context)
  }

  push(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }

  getContentType(context: Context): Type {
    throw new Error("TODO");
  }
}