import { Block } from "petals-stem/dist/src/block";
import { Procedures } from "petals-stem/dist/src/block/category/procedures";
import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { ID } from "petals-stem/dist/src/id";
import { Target } from "petals-stem/dist/src/target";
import { getUnknownReference } from "..";
import { MethodCallNode } from "../../../../types/ast/nodes/methodCall";
import { Context } from "../../context";
import { getInputLayerType, getType } from "../../getType";
import { call } from "../../translateInto/helpers/callMethod";
import { BooleanReference } from "../boolean/abstract";
import { ListReference } from "../list/abstract";
import { VariableReference } from "./abstract";

export class MethodCallResultReference extends VariableReference {
  protected callResult: VariableReference | undefined;

  constructor(
    protected readonly node: MethodCallNode,
  ) { super() }

  changeValue(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify method call result");
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot modify method call result");
  }

  performSideEffects(target: Target, thread: Block, context: Context): void {
    const result = call(this.node, target, thread, context);

    if (result instanceof ListReference) throw new Error("Expected method call result to be a variable reference");

    this.callResult = result;
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    const resRef = (this.callResult ?? call(this.node, target, thread, context));

    if (resRef instanceof ListReference) throw new Error("Expected method call result to be a variable reference");

    const res = resRef.getValue(target, thread, context);
    // capture result

    const intermediate = context.createVariable("___intermediate_" + ID.generate(), 0, getInputLayerType(res, context));

    intermediate.setValue(Input.shadowed(res), target, thread, context);

    return intermediate.getValue(target, thread, context);
  }
}
