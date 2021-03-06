import { AnyInput, Block, Blocks, Input, NumberInput, Target } from "petals-stem";

import { ListType, StructureType, Type } from "../../../../types/ast/type";
import { Context } from "../../context";
import { StructTool } from "../../structTool";
import { KnownLengthListReference, ListReference } from "./abstract";

export class ListIndexListReference extends ListReference {
  constructor(
    protected readonly base: ListReference,
    protected readonly index: Input,
    protected readonly myType: ListType,
  ) { super() }
  
  getContentType(context: Context): Type {
    return this.myType.getContentType();
  }

  push(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO!");
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO!");
  }

  deleteAll(target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO!");
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO!");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    return this.base.overwriteAtIndex(
      Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, 
        this.index,
        index
      )),
      value,
      target, thread, context,
    )
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): ListReference | AnyInput {
    console.trace(index);

    return this.base.getItemAtIndex(
      Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, 
        this.index,
        index
      )),
      target, thread, context,
    )
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO");
  }

  getLength(target: Target, thread: Block, context: Context): AnyInput {
    if (this.myType.isDefinitelySized()) {
      return new NumberInput(this.myType.getSize());
    }

    throw new Error("Cannot get length of unknown sized list");
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO");
  }
}

export class ListIndexStructureReference extends KnownLengthListReference {
  constructor(
    protected readonly base: ListReference,
    protected readonly index: Input,
    protected readonly myType: StructureType,
  ) { super() }

  getKnownLength(context: Context): number {
    return StructTool.getSize(this.myType);
  }

  getContentType(context: Context): Type {
    throw new Error("TODO");
  }

  push(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO!");
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO!");
  }

  deleteAll(target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO!");
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("TODO!");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    return this.base.overwriteAtIndex(
      Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, 
        this.index,
        index
      )),
      value,
      target, thread, context,
    )
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): ListReference | AnyInput {
    return this.base.getItemAtIndex(
      Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, 
        this.index,
        index
      )),
      target, thread, context,
    )
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO");
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO");
  }
}