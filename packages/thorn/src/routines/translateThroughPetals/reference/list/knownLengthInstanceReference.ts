import { Block } from "petals-stem/dist/src/block";
import { Variables } from "petals-stem/dist/src/block/category/variables";
import { Input } from "petals-stem/dist/src/block/input";
import { List } from "petals-stem/dist/src/list";
import { Target } from "petals-stem/dist/src/target";
import { Type, ListType, StructureType, UnionType } from "../../../../types/ast/type";
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

  containsItem(item: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.ListContainsItem> {
    return target.getBlocks().createBlock(
      Variables.ListContainsItem,
      this.list,
      item,
    );
  }
}
