import { AnyInput, Block, Blocks, Input, List, NumberInput, Target } from "petals-stem";

import { StructureType } from "../../../../types/ast/type";
import { Context } from "../../context";
import { StructTool } from "../../structTool";
import { ListReference } from "../list/abstract";
import { ListIndexListReference, ListIndexStructureReference } from "../list/indexReference";
import { VariableReference } from "./abstract";

export class VariableStructMemberReference extends VariableReference {
  constructor(
    protected readonly baseList: ListReference,
    protected readonly baseType: StructureType,
    protected readonly path: string[],
  ) { super() }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: Input, target: Target, thread: Block, context: Context): Block {
    return this.setValue(Input.shadowed(target.getBlocks().createBlock(
      Blocks.Operators.Add,
      Input.shadowed(this.getValue(target, thread, context)),
      value,
    )), target, thread, context)
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): Block {
    const index = StructTool.getIndex(this.baseType, this.path);

    if (index === undefined) throw new Error("Invalid path");

    let incr: number = 1;

    if (this.baseList instanceof ListIndexListReference || this.baseList instanceof ListIndexStructureReference) {
      incr = 0;
    }

    return this.baseList.overwriteAtIndex(Input.shadowed(new NumberInput(index + incr)), value, target, thread, context);
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    const index = StructTool.getIndex(this.baseType, this.path);

    if (index === undefined) throw new Error("Invalid path");

    let incr: number = 1;

    if (this.baseList instanceof ListIndexListReference || this.baseList instanceof ListIndexStructureReference) {
      incr = 0;
    }

    const v = this.baseList.getItemAtIndex(Input.shadowed(new NumberInput(index + incr)), target, thread, context);

    if (v instanceof ListReference) throw new Error("PANIC! VariableStructMemberReference actually points to a ListReference");

    return v;
  }
}