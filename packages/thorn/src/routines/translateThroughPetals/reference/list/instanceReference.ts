import { Block } from "petals-stem/dist/src/block";
import { Variables } from "petals-stem/dist/src/block/category/variables";
import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { List } from "petals-stem/dist/src/list";
import { Target } from "petals-stem/dist/src/target";
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

  push(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.AddToList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Variables.AddToList,
      this.list,
      value,
    ));
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.DeleteOfList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Variables.DeleteOfList,
      this.list,
      index,
    ))
  }

  deleteAll(target: Target, thread: Block, context: Context): InstanceType<typeof Variables.DeleteAllOfList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Variables.DeleteAllOfList,
      this.list,
    ))
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.InsertAtList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Variables.InsertAtList,
      this.list,
      index,
      value,
    ));
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.ReplaceItemOfList> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Variables.ReplaceItemOfList,
      this.list,
      index,
      value,
    ));
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.ItemOfList> {
    return target.getBlocks().createBlock(
      Variables.ItemOfList,
      this.list,
      index,
    );
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.ItemNumOfList> {
    return target.getBlocks().createBlock(
      Variables.ItemNumOfList,
      this.list,
      item,
    );
  }

  getLength(target: Target, thread: Block, context: Context): InstanceType<typeof Variables.LengthOfList> {
    return target.getBlocks().createBlock(
      Variables.LengthOfList,
      this.list,
    );
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.ListContainsItem> {
    return target.getBlocks().createBlock(
      Variables.ListContainsItem,
      this.list,
      item,
    );
  }
}
