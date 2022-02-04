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

export function getListReference(value: ValueTreeNode, context: Context): ListReference {
  if (value.type === "parenthesisedExpressionNode") return getListReference(value.getContents(), context);

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

  if (value.type === "propertyReference") {
    // check to make sure that we're referencing a struct

    let parent = value.getParent();
    let parentType = getType(parent, context);

    let path = [value.getProperty()];

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
      if (myType.isStructureType()) {
        if (context.isInRecursiveMethod()) {
          return new StructFunctionStackReference(getListReference(value, context), parentType, myType, path);
        }

        return new StructStructMemberReference(getListReference(parent, context), parentType, myType, path);
      }

      throw new Error("Cannot reference a struct member with a non-struct type");
    }

    throw new Error("Cannot reference a property of a non-struct type");
  }

  throw new Error("Cannot get list reference for: " + value.type);
}
