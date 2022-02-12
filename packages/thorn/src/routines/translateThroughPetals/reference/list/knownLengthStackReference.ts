import { Block, Blocks, Input, List, NumberInput, Target } from "petals-stem";

import { ListType, Type } from "../../../../types/ast/type";
import { Context } from "../../context";
import { getType } from "../../getType";
import { StructTool } from "../../structTool";
import { KnownLengthListReference } from "./abstract";

export class KnownLengthStackReference extends KnownLengthListReference {
  constructor(
    protected readonly list: List,
    protected readonly myType: Type,
  ) { super() }

  getKnownLength(context: Context): number {
    if (this.myType.isListType()) return this.myType.getSize();
    if (this.myType.isStructureType()) return StructTool.getSize(this.myType);

    throw new Error("Cannot statically determine list length");
  }

  getContentType(context: Context): Type {
    const myType = getType(this.list, context);

    if (myType.isListType()) return myType.getContentType();

    return myType;
  }

  push(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.AddToList> {
    throw new Error("Cannot modify size of fixed-length list");
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.DeleteOfList> {
    throw new Error("Cannot modify size of fixed-length list");
  }

  deleteAll(target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.DeleteAllOfList> {
    throw new Error("Cannot modify size of fixed-length list");
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.InsertAtList> {
    throw new Error("Cannot modify size of fixed-length list");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ReplaceItemOfList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Variables.ReplaceItemOfList,
      this.list,
      Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, index, Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Multiply,
        Input.shadowed(new NumberInput(StructTool.getSize(this.getContentType(context)))),
        Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___cidx")),
      )))),
      value,
    ));
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ItemOfList> {
    return target.getBlocks().createBlock(
      Blocks.Variables.ItemOfList,
      this.list,
      Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, index, Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Multiply,
        Input.shadowed(new NumberInput(StructTool.getSize(this.getContentType(context)))),
        Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___cidx")),
      )))),
    );
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ItemNumOfList> {
    throw new Error("TODO");
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ListContainsItem> {
    throw new Error("TODO");
  }
}