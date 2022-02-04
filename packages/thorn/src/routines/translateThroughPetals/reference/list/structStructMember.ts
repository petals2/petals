import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { StructureType, Type } from "../../../../types/ast/type";
import { Variables } from "petals-stem/dist/src/block/category/variables";
import { List } from "petals-stem/dist/src/list";
import { KnownLengthListReference, ListReference } from "./abstract";
import { StructTool } from "../../structTool";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { Operators } from "petals-stem/dist/src/block/category/operators";
import { VariableReference } from "../variable/abstract";
import { Control } from "petals-stem/dist/src/block/category/control";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";

export class StructStructMemberReference extends KnownLengthListReference {
  constructor(
    protected readonly baseList: ListReference,
    protected readonly baseType: StructureType,
    protected readonly myType: StructureType,
    protected readonly path: string[],
  ) { super() }

  getContentType(context: Context): Type {
    throw new Error("TODO");
  }

  push(item: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify the size of a struct member reference");
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO: slice out the items into a temp list, and act on that.")
  }

  deleteAll(target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify the size of a struct member reference");
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify the size of a struct member reference");
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO: slice out the items into a temp list, and act on that.")
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): ListReference | AnyInput {
    const myOffset = StructTool.getIndex(this.baseType, this.path);

    return this.baseList.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Operators.Add, index, myOffset)), target, thread, context)
  }

  getKnownLength(context: Context): number {
    return StructTool.getSize(this.myType);
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify the size of a struct member reference");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    const myOffset = StructTool.getIndex(this.baseType, this.path);

    return this.baseList.overwriteAtIndex(Input.shadowed(target.getBlocks().createBlock(Operators.Add, index, myOffset)), value, target, thread, context)
  }
}
