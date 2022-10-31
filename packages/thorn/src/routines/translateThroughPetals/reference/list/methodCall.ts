import { AnyInput, Block, Input, Target } from "petals-stem";

import { MethodCallNode } from "../../../../types/ast/nodes/methodCall";
import { NumberType, Type } from "../../../../types/ast/type";
import { Context } from "../../context";
import { VariableReference } from "../variable/abstract";
import { ListReference } from "./abstract";

export class MethodCallListReference extends ListReference {
  constructor(protected readonly value: MethodCallNode) {
    super();
  }

  push(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify a method call return value");
  }

  deleteAll(target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify a method call return value");
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify a method call return value");
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify a method call return value");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify a method call return value");
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO");
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    throw new Error("TODO");
  }

  getContentType(context: Context): Type {
    throw new Error("TODO");
  }

  getLength(target: Target, thread: Block, context: Context): AnyInput {
    const v = context.createVariable("___temp_length", 0, new NumberType());
    const baseVal = this.value.getBaseValue();

    if (baseVal.type !== "variableReference")
      throw new Error("Cannot get function from non-variable");

    const res = context.getReturnVariableForMethod(baseVal.getName());

    if (res instanceof VariableReference)
      throw new Error("Expected list, got variable");

    v.setValue(Input.shadowed(res.getLength(target, thread, context)), target, thread, context);

    return v.getValue(target, thread, context);
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): ListReference | AnyInput {
    const v = context.createVariable("___temp_length", 0, new NumberType());
    const baseVal = this.value.getBaseValue();

    if (baseVal.type !== "variableReference")
      throw new Error("Cannot get function from non-variable");

    const res = context.getReturnVariableForMethod(baseVal.getName());

    if (res instanceof VariableReference)
      throw new Error("Expected list, got variable");

    const retVal = res.getItemAtIndex(index, target, thread, context);

    if (retVal instanceof ListReference) throw new Error("Expected AnyValue, got list");

    v.setValue(Input.shadowed(retVal), target, thread, context);

    return v.getValue(target, thread, context);
  }

  copyInto(list: ListReference, target: Target, thread: Block, context: Context): void {
    const baseVal = this.value.getBaseValue();

    if (baseVal.type !== "variableReference")
      throw new Error("Cannot get function from non-variable");

    const res = context.getReturnVariableForMethod(baseVal.getName());

    if (res instanceof VariableReference)
      throw new Error("Expected list, got variable");

    return res.copyInto(list, target, thread, context);
  }
}