import { getUnknownReference } from "..";
import { StructLiteralNode } from "../../../../types/ast/nodes/structLiteral";
import { Context } from "../../context";
import { getType } from "../../getType";
import { StructTool } from "../../structTool";
import { StructureType, Type, UnionType } from "../../../../types/ast/type";
import { PositiveNumberInput } from "petals-stem/dist/src/block/input/positiveNumber";
import { IntegerInput } from "petals-stem/dist/src/block/input/integer";
import { PositiveIntegerInput } from "petals-stem/dist/src/block/input/positiveInteger";
import { AngleInput } from "petals-stem/dist/src/block/input/angle";
import { BooleanReference } from "../boolean/abstract";
import { VariableReference } from "../variable/abstract";
import { KnownListContentsReference, ListReference } from "./abstract";
import { Target, Block, Input, NumberInput, AnyInput } from "petals-stem";

export class StructLiteralReference extends KnownListContentsReference {
  constructor(protected readonly structLiteral: StructLiteralNode) {
    super();
  }

  structGetItemAtIndex(index: number, target: Target, thread: Block, context: Context) {
    const thisType = this.structLiteral.getType() ?? context.getStruct(this.structLiteral.getName()!);
    const pathAtIndex = StructTool.getPath(thisType, index);

    if (pathAtIndex.length === 0) throw new Error("No paths for index: " + index);
    if (pathAtIndex.length > 1) throw new Error("Multiple paths for index: " + index + ", " + pathAtIndex.map(p => `<${p.join(".")}>`).join(", "));

    const path = pathAtIndex[0];

    if (path.length === 0) throw new Error("Break before recursive self-reference in struct literal");

    const [name, ...rest] = path;

    const value = this.structLiteral.getValue()[name];

    if (value === undefined) throw new Error("No value for path: <" + path.join(".") + ">");

    const valueReference = getUnknownReference(value, target, thread, context);

    if (rest.length === 0) {
      if (valueReference instanceof VariableReference || valueReference instanceof BooleanReference) {
        return valueReference.getValue(target, thread, context);
      }

      return valueReference;
    }

    if (valueReference instanceof VariableReference || valueReference instanceof BooleanReference) {
      throw new Error("Cannot dig into path of variable reference");
    }

    // we now know that valueReference is a list reference
    // so we need to figure out the index into the list reference
    // to select the correct item

    // StructTool.getIndex allows us to get the index for a type and a path
    // we know the current path, so we now need to find the type of the
    // child.

    let givenChildType = getType(value, context);
    let expectedChildType = thisType.getValue(name.toString());

    if (expectedChildType === undefined) throw new Error("Internal error: expected child type to be defined");

    while (givenChildType.isReferenceType()) givenChildType = givenChildType.dereference();
    while (expectedChildType.isReferenceType()) expectedChildType = expectedChildType.dereference();

    console.log({ givenChildType, expectedChildType });

    if (!givenChildType.extends(expectedChildType)) {
      throw new Error("Struct passed unexpected type for path: <" + path.join(".") + ">");
    }

    // because of the valueReference check on VariableReference,
    // we know that givenChildType must be a list-like type

    if (givenChildType.isStructureType()) {
      const index = StructTool.getIndex(givenChildType, rest as string[]);

      if (index === undefined) throw new Error("Given struct type was not assignable to expected struct type");

      return valueReference.getItemAtIndex(Input.shadowed(new NumberInput(index)), target, thread, context)
    }

    if (givenChildType.isListType()) {
      const contentType = givenChildType.getContentType();

      if (StructTool.getSize(contentType) !== 1) {
        throw new Error("Complex-list type passed to struct literal. Not yet implemented");
      }

      return valueReference.getItemAtIndex(Input.shadowed(new NumberInput(rest[0] as number)), target, thread, context)
    }

    throw new Error("Internal error: failed to get item at index");
  }

  getContentType(context: Context): Type {
    return UnionType.reduce(new UnionType(...Object.values(this.structLiteral.getValue()).map(v => getType(v, context))));
  }

  push(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify a struct literal");
  }

  deleteAll(target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify a struct literal");
  }

  deleteAtIndex(index: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify a struct literal");
  }

  insertAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify a struct literal");
  }

  overwriteAtIndex(index: Input, value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify a struct literal");
  }

  getKnownLength(context: Context): number {
    return StructTool.getSize(this.structLiteral.getType() ?? context.getStruct(this.structLiteral.getName()!));
  }

  getContents(target: Target, thread: Block, context: Context): (ListReference | AnyInput)[] {
    const type = this.structLiteral.getType() ?? context.getStruct(this.structLiteral.getName()!);

    if (type === undefined) throw new Error("Cannot find struct by name: " + this.structLiteral.getName());
    if (!type.isStructureType()) throw new Error("Internal error: struct literal reference is not a struct type");

    const size = StructTool.getSize(type);
    const results = new Array <ListReference | AnyInput>(size);

    for (let i = 0; i < size; i++) {
      results[i] = this.structGetItemAtIndex(i, target, thread, context);
    }

    return results
  }

  containsItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    // TODO

    throw new Error();
  }

  getIndexOfItem(item: Input, target: Target, thread: Block, context: Context): AnyInput {
    // TODO

    throw new Error();
  }

  getItemAtIndex(index: Input, target: Target, thread: Block, context: Context): ListReference | AnyInput {
    const top = index.getTopLayer();

    if (top instanceof NumberInput || top instanceof PositiveNumberInput || top instanceof IntegerInput || top instanceof PositiveIntegerInput || top instanceof AngleInput) {
      return this.structGetItemAtIndex(top.getValue(), target, thread, context);
    }

    // TODO

    throw new Error();
  }
}
