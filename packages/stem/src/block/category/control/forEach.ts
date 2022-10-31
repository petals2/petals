import { NumberInput } from "../../input/number";
import { Input } from "../../input";
import { Block, SerializedBlock } from "../../block";
import { Variable } from "../../../variable";
import { VariableField } from "../../field/variable";
import { BlockKind } from "../../kinds";
import type { BlockStore, Project, ProjectReference, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class ForEach extends BlockKind.C<"control_for_each"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "control_delete_this_clone")
      throw new Error(`Expected opcode "control_delete_this_clone", got "${json.opcode}"`);

    if (json.fields.VARIABLE == undefined)
      throw new Error("Expected field VARIABLE on ForEach");

    if (json.inputs.VALUE == undefined)
      throw new Error("Expected input VALUE on ForEach");

    if (json.inputs.SUBSTACK == undefined)
      throw new Error("Expected input SUBSTACK on ForEach");

    let variable = context.getCurrentTarget()!.getVariables().findVariableById(json.fields.VARIABLE[1]!);

    if (variable == undefined)
      variable = context.getProject().getTargets().getStage().getVariables().findVariableById(json.fields.VARIABLE[1]!)

    if (variable === undefined)
      throw new Error("Could not find variable with ID " + json.fields.VARIABLE[1]);

    const value = Input.fromReference(context, serializedStore, json.inputs.VALUE);

    const substack = Input.fromReference(context, serializedStore, json.inputs.SUBSTACK);

    return new ForEach(variable, value, substack, ID);
  }

  constructor(variable: Variable, value: Input | number = 10, substack?: Block | Input, ID?: string) {
    super("control_for_each", ID);

    this.setVariable(variable);
    this.setValue(value);

    if (substack) { this.setSubstack(substack) }
  }

  setVariable(variable: Variable): this {
    this.setField("VARIABLE", new VariableField(variable));
    return this;
  }

  getVariable(): Variable {
    const field = this.getField("VARIABLE")!;

    if (!(field instanceof VariableField)) {
      throw new Error("ForEach VARIABLE field is not a variable field");
    }

    return field.getValue();
  }

  setValue(value: Input | number): this {
    if (typeof value === "number") {
      value = Input.shadowed(new NumberInput(value));
    }

    // block checking
    value.link(this);

    this.setInput("VALUE", value);

    return this;
  }

  getValue(): Input {
    return this.getInput("VALUE")!;
  }

  setSubstack(substack: Block | Input): this {
    if (substack instanceof Input) {
      const topLayer = substack.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("Expected input to be a block");
      }

      substack = topLayer;
    }

    substack.setParent(this);
    this.setInput("SUBSTACK", Input.unshadowed(substack));

    return this;
  }

  getSubstack(): Block | undefined {
    const input = this.getInput("SUBSTACK");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("Repeat SUBSTACK input is not a block");
      }

      return topLayer;
    }
  }
}
