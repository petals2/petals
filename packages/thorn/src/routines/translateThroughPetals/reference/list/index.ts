import { ValueTreeNode } from "../../../../types/ast/node";
import { ListReference } from "./abstract";
import { Context } from "../../context";
import { ListInstanceReference } from "./instanceReference";
import { ListLiteralReference } from "./arrayLiteralReference";
import { StructLiteralReference } from "./structLiteralReference";
import { StructTool } from "../../structTool";
import { getType } from "../../getType";
import { StructStructMemberReference } from "./structStructMember";
import { KnownLengthInstanceReference } from "./knownLengthInstanceReference";
import { StructFunctionStackReference } from "./structFunctionStackReference";
import { KnownLengthStackReference } from "./knownLengthStackReference";
import { List } from "petals-stem/dist/src/list";
import { VariableReference } from "../variable/abstract";
import { MethodCallListReference } from "./methodCall";
import { Block, Input, Target, Variable } from "petals-stem";
import { HeapDereference } from "./heapDereference";
import { VariableInstanceReference } from "../variable/instanceReference";
import { getVariableReference } from "../variable";
import { ListIndexListReference, ListIndexStructureReference } from "./indexReference";
import { HeapReferenceType, ListType, StructureType } from "../../../../types/ast/type";
import { Operators } from "petals-stem/dist/src/block/category";
import { ThisDereference } from "./thisDereference";

export function getListReference(value: ValueTreeNode, target: Target, thread: Block, context: Context): ListReference {
  if (value.type === "parenthesisedExpressionNode") return getListReference(value.getContents(), target, thread, context);

  if (value.type === "methodCall") {
    const baseVal = value.getBaseValue();

    if (baseVal.type !== "variableReference") throw new Error("Function call must be on a variable");

    const tmp = context.getReturnVariableForMethod(baseVal.getName());

    if (tmp instanceof VariableReference) throw new Error("Function return type expected to be a list");

    return new MethodCallListReference(value);
  }

  if (value.type === "variableReference") {
    let list = context.getList(value.getName());
    const type = getType(value, context);

    if (list instanceof VariableReference) {
      if (type.isHeapReferenceType()) {
        return new HeapDereference(list, [], type);
      }

      throw new Error("Expected a list");
    }

    if ((type.isListType() && type.isDefinitelySized()) || type.isStructureType()) {
      if (context.isInRecursiveMethod()) {
        return new KnownLengthStackReference(list, type);
      }

      return new KnownLengthInstanceReference(list, type);
    }

    return new ListInstanceReference(list);
  }

  if (value.type === "arrayLiteral") {
    return new ListLiteralReference(value);
  }

  if (value.type === "structLiteral") {
    return new StructLiteralReference(value);
  }

  if (value.type === "indexReference") {
    const base = value.getBase();
    const reference = value.getReference();
    const value2 = getVariableReference(reference, target, thread, context);
    const list = getListReference(base, target, thread, context);
    
    let t = getType(value, context);

    while (t.isReferenceType()) t = t.dereference();

    const index = target.getBlocks().createBlock(
      Operators.Add,
      Input.shadowed(target.getBlocks().createBlock(Operators.Multiply, Input.shadowed(value2.getValue(target, thread, context)), StructTool.getSize(t))),
      1,
    );

    if (t.isListType()) {
      return new ListIndexListReference(list, Input.shadowed(index), t);
    }

    if (t.isStructureType()) {
      return new ListIndexStructureReference(list, Input.shadowed(index), t);
    }

    throw new Error("Not a list.");
  }

  if (value.type === "propertyReference") {
    // check to make sure that we're referencing a struct

    let parent = value.getParent();
    let parentType = getType(parent, context);

    let path = [value.getProperty()];
    let rawParentType = parentType;

    while (parentType.isReferenceType()) parentType = parentType.dereference();

    while (parent.type === "propertyReference" && parentType.isStructureType()) {
      path.unshift(parent.getProperty());

      parent = parent.getParent();
      parentType = getType(parent, context);

      while (parentType.isReferenceType()) parentType = parentType.dereference();
    }

    let myType = getType(value, context);

    while (myType.isReferenceType()) myType = myType.dereference();

    if (parentType.isStructureType()) {
      if (myType.isHeapReferenceType()) {
        if (myType.dereference().isListType()) {
          return new HeapDereference(getVariableReference(value, target, thread, context), path, myType);
        }

        if (myType.dereference().isStructureType()) {
          throw new Error("TODO");
        }

        throw new Error("Attempted to get a list heap reference to a non-list element");
      }

      if (myType.isStructureType()) {
        if (context.isInRecursiveMethod()) {
          return new StructFunctionStackReference(getListReference(value, target, thread, context), parentType, myType, path);
        }

        return new StructStructMemberReference(getListReference(parent, target, thread, context), parentType, myType, path);
      }

      throw new Error("Cannot reference a struct member with a non-struct type");
    }

    throw new Error("Cannot reference a property of a non-struct type: "  + parentType.constructor.name);
  }

  if (value.type === "thisNode") {
    const klass = context.getCurrentClass();

    if (klass === undefined) throw new Error("Use of this outside of a class");

    return new ThisDereference(new HeapReferenceType(context.getStruct("___" + klass + "_struct"), "global"))
  }

  throw new Error("Cannot get list reference for: " + value.type);
}
