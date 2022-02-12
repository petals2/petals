import { Block } from "petals-stem/dist/src/block";
import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { AngleInput } from "petals-stem/dist/src/block/input/angle";
import { IntegerInput } from "petals-stem/dist/src/block/input/integer";
import { ListInput } from "petals-stem/dist/src/block/input/list";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { PositiveIntegerInput } from "petals-stem/dist/src/block/input/positiveInteger";
import { PositiveNumberInput } from "petals-stem/dist/src/block/input/positiveNumber";
import { StringInput } from "petals-stem/dist/src/block/input/string";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { List } from "petals-stem/dist/src/list";
import { Variable } from "petals-stem/dist/src/variable";
import { ValueTreeNode } from "../../types/ast/node";
import { ArrayLiteralNode } from "../../types/ast/nodes/arrayLiteral";
import { BooleanLiteralNode } from "../../types/ast/nodes/booleanLiteral";
import { ComparisonOperationNode } from "../../types/ast/nodes/comparisonOperation";
import { DecrementOperatorNode } from "../../types/ast/nodes/decrementOperator";
import { IncrementOperatorNode } from "../../types/ast/nodes/incrementOperator";
import { IndexReferenceNode } from "../../types/ast/nodes/indexReference";
import { MathOperationNode } from "../../types/ast/nodes/mathOperation";
import { MethodCallNode } from "../../types/ast/nodes/methodCall";
import { MethodDefinitionNode } from "../../types/ast/nodes/methodDefinition";
import { NegateOperator } from "../../types/ast/nodes/negateOperator";
import { NewNode } from "../../types/ast/nodes/newNode";
import { NumberLiteralNode } from "../../types/ast/nodes/numberLiteral";
import { ParenthesisedExpressionNode } from "../../types/ast/nodes/parenthesisedExpression";
import { PropertyReferenceNode } from "../../types/ast/nodes/propertyReference";
import { SelfReferenceNode } from "../../types/ast/nodes/selfReferenceNode";
import { HeapCopyOperation } from "../../types/ast/nodes/stackCopyOperation";
import { StringLiteralNode } from "../../types/ast/nodes/stringLiteral";
import { StructLiteralNode } from "../../types/ast/nodes/structLiteral";
import { ThisNode } from "../../types/ast/nodes/thisNode";
import { VariableRedefinitionNode } from "../../types/ast/nodes/variableRedefinitionNode";
import { VariableReferenceNode } from "../../types/ast/nodes/variableReference";
import { BooleanType, HeapReferenceType, ListType, LiteralType, NumberType, SelfType, StringType, Type, UnionType } from "../../types/ast/type";
import { ListApi } from "./api/list";
import { SelfApi } from "./api/self";
import { Context, typeApplyContext } from "./context";

export function getType(node: ValueTreeNode | Input | Variable | List | { name: string, type: Type } | string, ctx: Context): Type {
  if (typeof node === "string") {
    return dereferenceType(node, ctx);
  }

  if (node instanceof MethodDefinitionNode) {
    throw new Error("")
  }

  if (node instanceof StructLiteralNode) {
    return ctx.getStruct(node.getName());
  }

  if (node instanceof HeapCopyOperation) {
    return new HeapReferenceType(getType(node.getValue(), ctx), node.getName());
  }

  if ("type" in node && "name" in node) return node.type;

  if (node instanceof List) {
    return getListType(node, ctx);
  }

  if (node instanceof Variable) {
    return getVariableType(node, ctx);
  }

  if (node instanceof Input) {
    return getInputType(node, ctx);
  }

  if (node instanceof NumberLiteralNode) {
    return new LiteralType(node.getValue());
  }

  if (node instanceof BooleanLiteralNode) {
    return new LiteralType(node.getValue());
  }

  if (node instanceof StringLiteralNode) {
    return new LiteralType(node.getValue());
  }

  if (node instanceof NegateOperator) {
    return new BooleanType();
  }

  if (node instanceof ArrayLiteralNode) {
    if (node.getValues().length === 0) throw new Error("Cannot infer type of empty array");

    return new ListType(UnionType.reduce(new UnionType(...node.getValues().map(value => getType(value, ctx)))), node.getValues().length);
  }

  if (node instanceof MathOperationNode) {
    if (node.getOperation() === "+") {
      if (getType(node.getLeftHand(), ctx).extends(new UnionType(new NumberType(), new StringType())) || getType(node.getRightHand(), ctx).extends(new UnionType(new NumberType(), new StringType()))) {
        return new UnionType(new NumberType(), new StringType());
      }

      if (getType(node.getLeftHand(), ctx).extends(new StringType()) || getType(node.getRightHand(), ctx).extends(new StringType())) {
        return new StringType();
      }
    }

    return new NumberType();
  }

  if (node instanceof VariableRedefinitionNode) {
    return getType(node.getNewValue(), ctx);
  }

  if (node instanceof VariableReferenceNode) {
    if (ctx.hasList(node.getName())) {
      const l = ctx.getList(node.getName());

      if (l instanceof List) {
        return getType(l, ctx);
      }

      throw new Error("Cannot get type of variable reference acting as list");
    }

    return getType(ctx.getVariable(node.getName()), ctx);
  }

  if (node instanceof MethodCallNode) {
    const ref = node.getBaseValue();

    if (ref.type === "propertyReference") {
      const base = ref.getParent();
      let baseType = getType(base, ctx);

      while (baseType.isHeapReferenceType() || baseType.isReferenceType()) {
        baseType = baseType.dereference();
      }

      if (baseType.isStructureType() && baseType.getName().length > 0) {
        const klass = ctx.getClass(baseType.getName());

        if (klass === undefined) {
           throw new Error("Expected class; didn't get one");
        }

        return klass.getMethods()[ref.getProperty()].method.getReturnType();
      }
    }

    if (ref.type !== "variableReference") throw new Error("methodCallNode must have a variableReference as base value");

    const type = ctx.getType(ref.getName());

    if (type === undefined) throw new Error("missing type for method " + ref.getName());

    return type;
  }

  if (node instanceof PropertyReferenceNode) {
    let baseType = getType(node.getParent(), ctx);

    typeApplyContext(baseType, ctx);
    while (baseType.isReferenceType() || baseType.isHeapReferenceType()) baseType = baseType.dereference();

    if (baseType.isStructureType()) {
      const v = baseType.getValue(node.getProperty());

      if (v === undefined) throw new Error("missing property " + node.getProperty());

      return v;
    }

    if (baseType.isListType()) {
      return ListApi.getType(node.getProperty());
    }

    if (baseType.isSelfType()) {
      return SelfApi.getType(node.getProperty());
    }

    throw new Error("property reference on non-structure type");
  }

  if (node instanceof SelfReferenceNode) {
    return new SelfType();
  }

  if (node instanceof ParenthesisedExpressionNode) {
    return getType(node.getContents(), ctx);
  }

  if (node instanceof ComparisonOperationNode) {
    return new BooleanType();
  }

  if (node instanceof IncrementOperatorNode) {
    return new NumberType();
  }

  if (node instanceof DecrementOperatorNode) {
    return new NumberType();
  }

  if (node instanceof IndexReferenceNode) {
    let base = getType(node.getBase(), ctx);

    while (base.isReferenceType()) base = base.dereference();

    if (base.isListType()) {
      return base.getContentType()
    }

    if (base.isHeapReferenceType()) {
      let deref = base.dereference();

      while (deref.isReferenceType()) deref = deref.dereference();

      if (deref.isListType()) {
        return deref.getContentType();
      }

      throw new Error("Cannot get type of derefed index reference for: " + deref.constructor.name);
    }

    throw new Error("Cannot get type of index reference for: " + base.constructor.name);
  }

  if (node instanceof ThisNode) {
    const klass = ctx.getCurrentClass();

    if (klass == undefined) throw new Error("Use of `this` outside of class");

    return ctx.getStruct("___" + klass + "_struct");
  }

  if (node instanceof NewNode) {
    return new HeapReferenceType(ctx.getStruct("___" + node.getClass() + "_struct"), "global");
  }

  throw new Error("Unsupported node type: " + (node as any).type);
}

export function getListType(list: List, ctx: Context): ListType {
  const type = ctx.getType(list);

  if (!type) {
    throw new Error("List type not found");
  }

  return type;
}

export function getVariableType(variable: Variable, ctx: Context): Type {
  const type = ctx.getType(variable);

  if (!type) {
    throw new Error("Variable type not found");
  }

  return type;
}

export function getInputType(input: Input, ctx: Context): Type {
  const union = new UnionType();

  union.add(getInputLayerType(input.getTopLayer(), ctx));

  if (input.getBottomLayer()) union.add(getInputLayerType(input.getTopLayer()!, ctx));

  return UnionType.reduce(union);
}

export function getInputLayerType(input: ReturnType<Input["getTopLayer"]>, ctx: Context): Type {
  if (input instanceof Block) throw new Error();//return getBlockType(input, ctx);

  if (
    input instanceof NumberInput ||
    input instanceof PositiveNumberInput ||
    input instanceof IntegerInput ||
    input instanceof PositiveIntegerInput ||
    input instanceof AngleInput ||
    input instanceof StringInput
  ) return getInputFromLiteralLikeInput(input, ctx);

  if (input instanceof VariableInput) return getVariableType(input.getValue(), ctx);

  if (input instanceof ListInput) return getListType(input.getValue(), ctx);

  throw new Error("Unknown input type");
}

export function getInputFromLiteralLikeInput(input: { getValue(): number | boolean | string }, ctx: Context): LiteralType {
  return new LiteralType(input.getValue());
}

// export function getBlockType(block: Block, ctx: Context): Type {
//   if (block instanceof )
// }

export function dereferenceType(name: string, ctx: Context): Type {
  if (ctx.hasStruct(name)) {
    return ctx.getStruct(name);
  }

  if (ctx.hasClass(name)) {
    return ctx.getStruct("___" + name + "_struct");
  }

  throw new Error("Failed to deref type: " + name);
}
