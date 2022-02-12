import { AnyInput, Block, Blocks, Input, NumberInput, Target } from "petals-stem";

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

    const myOffset = target.getBlocks().createBlock(Blocks.Operators.Add, Input.shadowed(new NumberInput(index2)), Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Multiply, StructTool.getSize(this.baseType), Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___cidx")))));

    return this.baseList.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, index, Input.shadowed(myOffset))), target, thread, context)
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

    const myOffset = target.getBlocks().createBlock(Blocks.Operators.Add, Input.shadowed(new NumberInput(index2)), Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Multiply, StructTool.getSize(this.baseType), Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___cidx")))));

    return this.baseList.overwriteAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, index, Input.shadowed(myOffset))), value, target, thread, context)
  }
}