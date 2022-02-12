import { List } from "petals-stem/dist/src/list";
import { Variable } from "petals-stem/dist/src/variable";
import { ValueTreeNode } from "../../../../types/ast/node";
import { Context, typeApplyContext } from "../../context";
import { getType } from "../../getType";
import { getListReference } from "../list";
import { VariableReference } from "./abstract";
import { FunctionArgumentReference } from "./functionArgument";
import { VariableFunctionStackReference } from "./functionStackReference";
import { VariableInstanceReference } from "./instanceReference";
import { MathOperationReference } from "./mathOperation";
import { NumberLiteralReference } from "./numberLiteralReference";
import { StringLiteralReference } from "./stringLiteralReference";
import { VariableStructMemberReference } from "./structMember";
import { MethodCallResultReference } from "./methodCall";
import { VariableHeapCopyReference } from "./heapCopy";
import { VariableHeapDereference } from "./heapDereference";
import { ListApi } from "../../api/list";
import { VariableIndexReference } from "./indexReference";
import { Target, Block } from "petals-stem";
import { NewResultReference } from "./new";
import { HeapReferenceType } from "../../../../types/ast/type";
import { SelfApi } from "../../api/self";
import { InvalidValueError } from "../../../../errors/invalidValue";

export function getVariableReference(value: ValueTreeNode, target: Target, thread: Block, context: Context): VariableReference {
  if (value.type === "parenthesisedExpressionNode") return getVariableReference(value.getContents(), target, thread, context);

  if (value.type === "variableReference") {
    const variable = context.getVariable(value.getName());

    if (variable instanceof Variable) {
      return new VariableInstanceReference(variable);
    }

    if (variable instanceof List) {
      const type = getType(value, context);

      return new VariableFunctionStackReference(variable, type);
    }

    return new FunctionArgumentReference(variable.name);
  }

  if (value.type === "propertyReference") {
    let parent = value.getParent();
    let parentType = getType(parent, context);

    let path = [value.getProperty()];

    if (parentType.isHeapReferenceType()) {
      let baseParentType = parentType.dereference();

      while (baseParentType.isHeapReferenceType() || baseParentType.isReferenceType()) {
        if (baseParentType.isReferenceType()) baseParentType.loadIntoContext(context);

        baseParentType = baseParentType.dereference()
      }

      if (baseParentType.isStructureType()) {
        return new VariableHeapDereference(getVariableReference(parent, target, thread, context), path, parentType);
      }
    }

    if (parentType.isHeapReferenceType()) parentType = parentType.dereference();

    if (parentType.isListType()) {
      return ListApi.getVariableReference(getListReference(parent, target, thread, context), value.getProperty(), context)
    }

    if (parentType.isSelfType()) {
      return SelfApi.getVariableReference(value.getProperty(), context);
    }

    while (parentType.isReferenceType()) parentType = parentType.dereference();

    while (parent.type === "propertyReference" && parentType.isStructureType()) {
      if (parentType.isStructureType()) {
        path.unshift(parent.getProperty());
  
        parent = parent.getParent();
        parentType = getType(parent, context);
  
        while (parentType.isReferenceType()) parentType = parentType.dereference();
        continue;
      }
    }

    typeApplyContext(parentType, context);

    if (parentType.isStructureType()) {
      return new VariableStructMemberReference(getListReference(parent, target, thread, context), parentType, path);
    }

    throw new Error("Cannot reference a property (" + value.getProperty() + ") of a non-struct type (" + parentType.constructor.name + ")");
  }

  if (value.type === "stringLiteral") return new StringLiteralReference(value.getValue());
  if (value.type === "numberLiteral") return new NumberLiteralReference(value.getValue());
  if (value.type === "mathOperation") return new MathOperationReference(value.getLeftHand(), value.getRightHand(), value.getOperation(), target, thread, context);
  if (value.type === "methodCall") return new MethodCallResultReference(value);
  if (value.type === "heapCopy") return new VariableHeapCopyReference(value);
  if (value.type === "indexReference") return new VariableIndexReference(value);
  if (value.type === "new") return new NewResultReference(new HeapReferenceType(context.getStruct("___" + value.getClass() + "_struct"), "global"), value)

  throw new InvalidValueError(context, value);
}
