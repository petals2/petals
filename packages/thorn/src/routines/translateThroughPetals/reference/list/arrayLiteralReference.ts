import {
  AngleInput,
  AnyInput,
  Block,
  Blocks,
  ID,
  Input,
  IntegerInput,
  NumberInput,
  PositiveIntegerInput,
  PositiveNumberInput,
  Target
} from "petals-stem";

import { getListReference } from ".";
import { getUnknownReference } from "..";
import { ArrayLiteralNode } from "../../../../types/ast/nodes/arrayLiteral";
import { ListType, Type } from "../../../../types/ast/type";
import { Context } from "../../context";
import { getType } from "../../getType";
import { getVariableReference } from "../variable";
import { KnownListContentsReference, ListReference } from "./abstract";
import { ListInstanceReference } from "./instanceReference";

export class ListLiteralReference extends KnownListContentsReference {
  constructor(
    protected readonly literal: ArrayLiteralNode,
  ) {
    super();

    if (literal.getValues().length === 0) throw new Error("Array literals cannot be empty");
  }

  getContentType(context: Context): Type {
    return (getType(this.literal, context) as ListType).getContentType();
  }

  getContents(target: Target, thread: Block, context: Context): AnyInput[] | ListReference[] {
    if (this.getContentType(context).isStructureType())  {
      return this.literal.getValues().map(e => getListReference(e, target, thread, context));
    }

    return this.literal.getValues().map(e => getVariableReference(e, target, thread, context).getValue(target, thread, context));
  }

  getKnownLength(): number {
    return this.literal.getValues().length;
  }

  protected write(target: Target, thread: Block, context: Context): ListInstanceReference {
    const l = context.createList("___intermediate_" + ID.generate(), [], getType(this.literal, context));

    const values = this.literal.getValues();

    const gen = target.getBlocks().generateStack(function* () {
      yield new Blocks.Variables.DeleteAllOfList(l);
      for (let i = 0; i < values.length; i++) {
        const element = values[i];
        const ref = getUnknownReference(element, target, thread, context);

        if (ref instanceof ListReference) throw new Error("List literals cannot contain lists");

        yield new Blocks.Variables.AddToList(l, Input.shadowed(ref.getValue(target, thread, context)));
      }
    });

    thread.getTail().append(gen);

    return new ListInstanceReference(l);
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    return this.write(target, thread, context).containsItem(item, target, thread, context);
  }

  deleteAll(target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify an array literal");
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify an array literal");
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): AnyInput {
    const top = index.getTopLayer();

    if (top instanceof NumberInput || top instanceof PositiveIntegerInput || top instanceof PositiveNumberInput || top instanceof IntegerInput || top instanceof AngleInput) {
      return getVariableReference(this.literal.getValues()[top.getValue()], target, thread, context).getValue(target, thread, context)
    }

    return this.write(target, thread, context).getItemAtIndex(index, target, thread, context);
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ItemNumOfList> {
    return this.write(target, thread, context).getIndexOfItem(item, target, thread, context);
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify an array literal");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify an array literal");
  }

  push(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify an array literal");
  }
}