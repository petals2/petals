import { Block, Blocks, Input, List, Target } from "petals-stem";

import { ListType, Type } from "../../../../types/ast/type";
import { Context } from "../../context";
import { getType } from "../../getType";
import { ListReference } from "./abstract";

export class ListInstanceReference extends ListReference {
  constructor(
    protected readonly list: List,
  ) { super() }

  getContentType(context: Context): Type {
    return (getType(this.list, context) as ListType).getContentType()
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

  getLength(target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.LengthOfList> {
    return target.getBlocks().createBlock(
      Blocks.Variables.LengthOfList,
      this.list,
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