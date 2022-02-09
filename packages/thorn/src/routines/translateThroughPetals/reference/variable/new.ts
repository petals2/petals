import { Input, Target, Block, NumberInput } from "petals-stem";
import { Procedures } from "petals-stem/dist/src/block/category";
import { NewNode } from "../../../../types/ast/nodes/newNode";
import { HeapReferenceType } from "../../../../types/ast/type";
import { Context } from "../../context";
import { StructTool } from "../../structTool";
import { VariableReference } from "./abstract";

export class NewResultReference extends VariableReference {
  constructor(
    protected readonly type: HeapReferenceType,
    protected readonly newNode: NewNode,
  ) { super() }

  changeValue(value: Input, target: Target, thread: Block<string>, context: Context): Block<string> {
    throw new Error("Cannot change value of a new result");
  }

  performSideEffects(target: Target, thread: Block<string>, context: Context): void {
    // do the funny malloc
    thread.append(target.getBlocks().createBlock(Procedures.Call, context.getHeap(this.type.getHeapName()).malloc.getPrototype(), Input.shadowed(new NumberInput(StructTool.getSize(this.type.dereference())))));
  }
}
