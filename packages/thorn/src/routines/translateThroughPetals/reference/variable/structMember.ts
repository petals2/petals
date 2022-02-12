import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { VariableReference } from "./abstract";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { StructureType } from "../../../../types/ast/type";
import { Variables } from "petals-stem/dist/src/block/category/variables";
import { List } from "petals-stem/dist/src/list";
import { ListReference } from "../list/abstract";
import { StructTool } from "../../structTool";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { Operators } from "petals-stem/dist/src/block/category/operators";
import { ListIndexListReference, ListIndexStructureReference } from "../list/indexReference";

export class VariableStructMemberReference extends VariableReference {
  constructor(
    protected readonly baseList: ListReference,
    protected readonly baseType: StructureType,
    protected readonly path: string[],
  ) { super() }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: Input, target: Target, thread: Block, context: Context): Block {
    return this.setValue(Input.shadowed(target.getBlocks().createBlock(
      Operators.Add,
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
