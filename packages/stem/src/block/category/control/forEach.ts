import { NumberInput } from "../../input/number";
import { Input } from "../../input";
import { Block } from "../../block";
import { Variable } from "../../../variable";
import { VariableField } from "../../field/variable";
import { BlockKind } from "../../kinds";

export class ForEach extends BlockKind.C<"control_for_each"> {
  constructor(variable: Variable, value: Input | number = 10, substack?: Block) {
    super("control_for_each");

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

  setSubstack(substack: Block): this {
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
