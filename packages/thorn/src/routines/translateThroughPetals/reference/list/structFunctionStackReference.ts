import { Block } from "petals-stem/dist/src/block";
import { Argument } from "petals-stem/dist/src/block/category/argument";
import { Operators } from "petals-stem/dist/src/block/category/operators";
import { Input, AnyInput } from "petals-stem/dist/src/block/input";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { Target } from "petals-stem/dist/src/target";
import { StructureType, Type } from "../../../../types/ast/type";
import { Context } from "../../context";
import { StructTool } from "../../structTool";
import { KnownLengthListReference, ListReference } from "./abstract";

export class StructFunctionStackReference extends KnownLengthListReference {
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
    const index2 = StructTool.getIndex(this.baseType, this.path);

    if (index2 === undefined) throw new Error("Invalid path");

    const myOffset = target.getBlocks().createBlock(Operators.Add, Input.shadowed(new NumberInput(index2)), Input.shadowed(target.getBlocks().createBlock(Operators.Multiply, StructTool.getSize(this.baseType), Input.shadowed(target.getBlocks().createBlock(Argument.ReporterStringNumber, "___cidx")))));

    return this.baseList.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Operators.Add, index, Input.shadowed(myOffset))), target, thread, context)
  }

  getKnownLength(context: Context): number {
    return StructTool.getSize(this.myType);
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify the size of a struct member reference");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    const index2 = StructTool.getIndex(this.baseType, this.path);

    if (index2 === undefined) throw new Error("Invalid path");

    const myOffset = target.getBlocks().createBlock(Operators.Add, Input.shadowed(new NumberInput(index2)), Input.shadowed(target.getBlocks().createBlock(Operators.Multiply, StructTool.getSize(this.baseType), Input.shadowed(target.getBlocks().createBlock(Argument.ReporterStringNumber, "___cidx")))));

    return this.baseList.overwriteAtIndex(Input.shadowed(target.getBlocks().createBlock(Operators.Add, index, Input.shadowed(myOffset))), value, target, thread, context)
  }
}
