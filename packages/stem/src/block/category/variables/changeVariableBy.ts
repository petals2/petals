import { Variable } from "../../../variable";
import { VariableField } from "../../field/variable";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class ChangeVariableBy extends BlockKind.Stack {
  constructor(variable: Variable, value: number | Input) {
    super("data_changevariableby");

    this.setVariable(variable);
    this.setValue(value);
  }

  setVariable(variable: Variable): this {
    this.setField("VARIABLE", new VariableField(variable));
    return this;
  }

  getList(): Variable {
    const field = this.getField("VARIABLE");

    if (!(field instanceof VariableField)) {
      throw new Error("ChangeVariableBy VARIABLE field is not a variable field");
    }

    return field.getValue();
  }

  setValue(value: number | Input): this {
    if (typeof value === "number") {
      value = Input.shadowed(new NumberInput(value));
    }

    value.link(this);

    this.setInput("VALUE", value);

    return this;
  }

  getValue(): Input {
    return this.getInput("VALUE")!;
  }
}
