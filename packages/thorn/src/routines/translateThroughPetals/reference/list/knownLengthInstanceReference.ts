import { Block, Blocks, Input, List, Target } from "petals-stem";

import { ListType, StructureType, Type, UnionType } from "../../../../types/ast/type";
import { Context } from "../../context";
import { getType } from "../../getType";
import { StructTool } from "../../structTool";
import { KnownLengthListReference } from "./abstract";

export class KnownLengthInstanceReference extends KnownLengthListReference {
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
    const t = getType(this.list, context);

    if (t.isListType()) {
      return t.getContentType()
    }

    if (t.isStructureType()) {
      return new UnionType(...t.getValues().values());
    }

    throw new Error("Cannot get content type of " + t.constructor.name);
  }

  push(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.AddToList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Variables.AddToList,
      this.list,
      value,
    ));
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.DeleteOfList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Variables.DeleteOfList,
      this.list,
      index,
    ))
  }

  deleteAll(target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.DeleteAllOfList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Variables.DeleteAllOfList,
      this.list,
    ))
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.InsertAtList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Variables.InsertAtList,
      this.list,
      index,
      value,
    ));
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ReplaceItemOfList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Variables.ReplaceItemOfList,
      this.list,
      index,
      value,
    ));
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ItemOfList> {
    return target.getBlocks().createBlock(
      Blocks.Variables.ItemOfList,
      this.list,
      index,
    );
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ItemNumOfList> {
    return target.getBlocks().createBlock(
      Blocks.Variables.ItemNumOfList,
      this.list,
      item,
    );
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ListContainsItem> {
    return target.getBlocks().createBlock(
      Blocks.Variables.ListContainsItem,
      this.list,
      item,
    );
  }
}