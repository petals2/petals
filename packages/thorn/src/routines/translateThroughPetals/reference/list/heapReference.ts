import { AnyInput, Block, Blocks, ID, Input, Target } from "petals-stem";

import { NumberType, StringType, Type, UnionType } from "../../../../types/ast/type";
import { Context, HeapReferenceData } from "../../context";
import { VariableReference } from "../variable/abstract";
import { ListReference } from "./abstract";

export class HeapReference extends ListReference {
  static allocate(heap: HeapReferenceData, size: Input, target: Target, thread: Block, context: Context) {
    thread.getTail().append(target.getBlocks().createBlock(Blocks.Procedures.Call, heap.malloc.getPrototype(), undefined, size));

    const retVal = context.createVariable("___intermediate_" + ID.generate(), 0, new UnionType(new NumberType(), new StringType()));

    retVal.setValue(Input.shadowed(heap.mallocReturn.getValue(target, thread, context)), target, thread, context);

    return new HeapReference(heap, retVal);
  }

  constructor(
    protected readonly heap: HeapReferenceData,
    public readonly heapIndex: VariableReference,
  ) {
    super();
  }

  getHeap(): HeapReferenceData {
    return this.heap;
  }

  getPointer(target: Target, thread: Block, context: Context): AnyInput {
    return this.heap.heapIndexes.getItemAtIndex(Input.shadowed(this.heapIndex.getValue(target, thread, context)), target, thread, context) as AnyInput;
  }

  getContentType(context: Context): Type {
    throw new Error("TODO");
  }

  getLength(target: Target, thread: Block, context: Context): AnyInput {
    return this.heap.heap.getItemAtIndex(Input.shadowed(this.getPointer(target, thread, context)), target, thread, context) as AnyInput;
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO");
  }

  deleteAll(target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): AnyInput {
    return this.heap.heap.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, index, Input.shadowed(this.getPointer(target, thread, context)))), target, thread, context) as AnyInput;
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ItemNumOfList> {
    throw new Error("TODO");
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    return this.heap.heap.overwriteAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, index, Input.shadowed(this.getPointer(target, thread, context)))), value, target, thread, context);
  }

  push(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO");
  }
}