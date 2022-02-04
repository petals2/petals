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

  copyInto(list: ListReference, target: Target, thread: Block, context: Context, redefining: boolean = true): void {
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

  copyInto(list: ListReference, target: Target, thread: Block, context: Context, redefining: boolean = true): void {
    if (redefining) {
      list.deleteAll(target, thread, context);

      for (let i = 0; i < this.getKnownLength(context); i++) {
        const v = this.getItemAtIndex(Input.shadowed(new NumberInput(i)), target, thread, context);

        if (v instanceof ListReference) throw new Error("Figure out why this happens / how to fix it");

        list.push(Input.shadowed(v), target, thread, context);
      }

      return;
    }

    for (let i = 0; i < this.getKnownLength(context); i++) {
      const v = this.getItemAtIndex(Input.shadowed(new NumberInput(i)), target, thread, context);

      if (v instanceof ListReference) throw new Error("Figure out why this happens / how to fix it");

      list.overwriteAtIndex(Input.shadowed(new NumberInput(i + 1)), Input.shadowed(v), target, thread, context);
    }
  }
}

export abstract class KnownListContentsReference extends KnownLengthListReference {
  isKnownContents(): this is KnownListContentsReference { return true }
  abstract getContents(target: Target, thread: Block, context: Context): (ListReference | AnyInput)[];

  copyInto(list: ListReference, target: Target, thread: Block, context: Context, redefining: boolean = true): void {
    if (redefining) {
      list.deleteAll(target, thread, context);

      for (const item of this.getContents(target, thread, context)) {
        if (item instanceof ListReference) throw new Error("Figure out why this happens / how to fix it");

        list.push(Input.shadowed(item), target, thread, context);
      }

      return;
    }

    let i = 0;
    for (const item of this.getContents(target, thread, context)) {
      if (item instanceof ListReference) throw new Error("Figure out why this happens / how to fix it");

      list.overwriteAtIndex(Input.shadowed(new NumberInput(i + 1)), Input.shadowed(item), target, thread, context);
      i++;
    }
  }
}
