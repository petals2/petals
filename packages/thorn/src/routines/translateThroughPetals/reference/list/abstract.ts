import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { Type } from "../../../../types/ast/type";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { ID } from "petals-stem/dist/src/id";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { Control } from "petals-stem/dist/src/block/category/control";
import { StructTool } from "../../structTool";
import { getType } from "../../getType";

export abstract class ListReference {
  isKnownLength(): this is KnownLengthListReference { return false };
  isKnownContents(): this is KnownListContentsReference { return false };
  abstract getContentType(context: Context): Type;
  abstract push(value: Input, target: Target, thread: Block, context: Context): Block;
  abstract deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): Block;
  abstract deleteAll(target: Target, thread: Block, context: Context): Block;
  abstract insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block;
  abstract overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block;
  abstract getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): AnyInput | ListReference;
  abstract getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): AnyInput;
  abstract getLength(target: Target, thread: Block, context: Context): AnyInput;
  abstract containsItem(item: Input, target: Target, thread: Block, context: Context): AnyInput;

   copyInto(list: ListReference, target: Target, thread: Block, context: Context, redefining: boolean = true, startIndex?: number): void {
    if (redefining) {
      const intermediate = target.getVariables().createVariable("___intermediate_incrementor_" + ID.generate(), 0);
      const phantom = target.getBlocks().createBlock(Phantom);

      list.deleteAll(target, thread, context);

      list.push(Input.shadowed(this.getItemAtIndex(Input.shadowed(new VariableInput(intermediate)), target, phantom, context) as AnyInput), target, phantom, context);

      thread.getTail().append(target.getBlocks().createBlock(Control.ForEach, intermediate, Input.shadowed(this.getLength(target, thread, context)), phantom));
      return;
    }

    const intermediate = target.getVariables().createVariable("___intermediate_incrementor_" + ID.generate(), 0);
    const phantom = target.getBlocks().createBlock(Phantom);

    list.deleteAll(target, thread, context);

    list.overwriteAtIndex(Input.shadowed(new VariableInput(intermediate)), Input.shadowed(this.getItemAtIndex(Input.shadowed(new VariableInput(intermediate)), target, phantom, context) as AnyInput), target, phantom, context);

    thread.getTail().append(target.getBlocks().createBlock(Control.ForEach, intermediate, Input.shadowed(this.getLength(target, thread, context)), phantom));
  }
}

export abstract class KnownLengthListReference extends ListReference {
  isKnownLength(): this is KnownLengthListReference { return true };
  abstract getKnownLength(context: Context): number;

  getLength(target: Target, thread: Block, context: Context): AnyInput {
    return new NumberInput(this.getKnownLength(context))
  }

  copyInto(list: ListReference, target: Target, thread: Block, context: Context, redefining: boolean = true, startIndex?: number): void {
    if (startIndex === undefined) {
      if (redefining) {
        list.deleteAll(target, thread, context);
  
        for (let i = 0; i < this.getKnownLength(context); i++) {
          const item = this.getItemAtIndex(Input.shadowed(new NumberInput(i + 1)), target, thread, context);
          
          if (!(item instanceof ListReference)) {
            list.push(Input.shadowed(item), target, thread, context);
            continue;
          }
  
          if (item instanceof KnownLengthListReference) {
            item.copyInto(list, target, thread, context, true);
          } else {
            throw new Error("Cannot copy unsized lists into a list");
          }
        }
  
        return;
      }

      for (let i = 0; i < this.getKnownLength(context); i) {
        const item = this.getItemAtIndex(Input.shadowed(new NumberInput(i + 1)), target, thread, context);

        if (!(item instanceof ListReference)) {
          list.overwriteAtIndex(Input.shadowed(new NumberInput(i + 1)), Input.shadowed(item), target, thread, context);
          i += StructTool.getSize(this.getContentType(context));
          continue;
        }

        if (item instanceof KnownLengthListReference) {
          item.copyInto(list, target, thread, context, false, i);
          i += StructTool.getSize(item.getContentType(context)) * item.getKnownLength(context);
        } else {
          throw new Error("Cannot copy unsized lists into a list");
        }
      }

      return;
    }

    if (redefining) throw new Error("Cannot pass a start index into a redefined list... Maybe TODO");

    for (let i = 0; i < this.getKnownLength(context); i) {
      const item = this.getItemAtIndex(Input.shadowed(new NumberInput(i + 1)), target, thread, context);

      if (!(item instanceof ListReference)) {
        list.overwriteAtIndex(Input.shadowed(new NumberInput(i + 1 + startIndex)), Input.shadowed(item), target, thread, context);
        i += StructTool.getSize(this.getContentType(context));
        continue;
      }

      if (item instanceof KnownLengthListReference) {
        item.copyInto(list, target, thread, context, false, i);
        i += StructTool.getSize(item.getContentType(context)) * item.getKnownLength(context);
      } else {
        throw new Error("Cannot copy unsized lists into a list");
      }
    }
  }
}

export abstract class KnownListContentsReference extends KnownLengthListReference {
  isKnownContents(): this is KnownListContentsReference { return true }
  abstract getContents(target: Target, thread: Block, context: Context): (ListReference | AnyInput)[];

  copyInto(list: ListReference, target: Target, thread: Block, context: Context, redefining: boolean = true, startIndex?: number): void {
    if (startIndex == undefined) {
      if (redefining) {
        list.deleteAll(target, thread, context);
  
        for (const item of this.getContents(target, thread, context)) {
          if (!(item instanceof ListReference)) {
            list.push(Input.shadowed(item), target, thread, context);
            continue;
          }
  
          if (item instanceof KnownLengthListReference) {
            item.copyInto(list, target, thread, context, true);
          } else {
            throw new Error("Cannot copy unsized lists into a list");
          }
        }
  
        return;
      }
  
      let i = 0;
      for (const item of this.getContents(target, thread, context)) {
        if (!(item instanceof ListReference)) {
          list.overwriteAtIndex(Input.shadowed(new NumberInput(i + 1)), Input.shadowed(item), target, thread, context);
          i += StructTool.getSize(this.getContentType(context));
          continue;
        }

        if (item instanceof KnownLengthListReference) {
          item.copyInto(list, target, thread, context, false, i);
          i += StructTool.getSize(item.getContentType(context)) * item.getKnownLength(context);
        } else {
          throw new Error("Cannot copy unsized lists into a list");
        }
      }

      return;
    }

    if (redefining) throw new Error("Cannot pass a start index into a redefined list... Maybe TODO");

    let i = startIndex;
    for (const item of this.getContents(target, thread, context)) {
      if (!(item instanceof ListReference)) {
        list.overwriteAtIndex(Input.shadowed(new NumberInput(i + 1)), Input.shadowed(item), target, thread, context);
        i += StructTool.getSize(this.getContentType(context));
        continue;
      }

      if (item instanceof KnownLengthListReference) {
        item.copyInto(list, target, thread, context, false, i);
        i += StructTool.getSize(item.getContentType(context)) * item.getKnownLength(context);
      } else {
        throw new Error("Cannot copy unsized lists into a list");
      }
    }
  }
}
