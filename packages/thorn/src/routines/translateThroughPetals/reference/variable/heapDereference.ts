import { AnyInput, Block, Blocks, Input, NumberInput, Target } from "petals-stem";

import { ClassType, HeapReferenceType, StructureType } from "../../../../types/ast/type";
import { Context } from "../../context";
import { StructTool } from "../../structTool";
import { ListReference } from "../list/abstract";
import { VariableReference } from "./abstract";

export class VariableHeapDereference extends VariableReference {
  constructor (protected baseInstance: VariableReference, protected readonly path: string[], protected parentType: HeapReferenceType | ClassType) {
    super();

    let deref = parentType.dereference();

    while (deref.isReferenceType() || deref.isHeapReferenceType()) deref = deref.dereference();

    if (!deref.isStructureType()) {
      throw new Error("VariableHeapDereference must be used on a structure type");
    }
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: Input, target: Target, thread: Block, context: Context): Block {
    return this.setValue(Input.shadowed(target.getBlocks().createBlock(
      Blocks.Operators.Add,
      Input.shadowed(this.getValue(target, thread, context)),
      value,
    )), target, thread, context)
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): Block {
    const heap = context.getHeap(this.parentType.getHeapName());
    const structureType = this.parentType.dereference() as StructureType;
    const index = StructTool.getIndex(structureType, this.path);

    if (index === undefined) throw new Error("Invalid path");

    const v0 = heap.heapIndexes.getItemAtIndex(Input.shadowed(this.baseInstance.getValue(target, thread, context)), target, thread, context);

    if (v0 instanceof ListReference) throw new Error("PANIC! HeapIndexes itemAtIndex returned a ListReference");

    const v = heap.heap.overwriteAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, Input.shadowed(v0), Input.shadowed(new NumberInput(index + 1)))), value, target, thread, context)

    if (v instanceof ListReference) throw new Error("PANIC! VariableHeapDereference actually points to a ListReference");

    return v;
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    const heap = context.getHeap(this.parentType.getHeapName());
    const structureType = this.parentType.dereference() as StructureType;
    const index = StructTool.getIndex(structureType, this.path);

    if (index === undefined) throw new Error("Invalid path");

    const v0 = heap.heapIndexes.getItemAtIndex(Input.shadowed(this.baseInstance.getValue(target, thread, context)), target, thread, context);

    if (v0 instanceof ListReference) throw new Error("PANIC! HeapIndexes itemAtIndex returned a ListReference");

    const v = heap.heap.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, Input.shadowed(v0), Input.shadowed(new NumberInput(index + 1)))), target, thread, context)

    if (v instanceof ListReference) throw new Error("PANIC! VariableHeapDereference actually points to a ListReference");

    return v;
  }
}