import { Variable } from "../../../variable";
import { VariableField } from "../../field/variable";
import { BlockKind } from "../../kinds";

export class ShowVariable extends BlockKind.Stack {
  constructor(variable: Variable) {
    super("data_showvariable");

    this.setList(variable);
  }

  setList(variable: Variable): this {
    this.setField("VARIABLE", new VariableField(variable));
    return this;
  }

  getList(): Variable {
    const field = this.getField("VARIABLE");

    if (!(field instanceof VariableField)) {
      throw new Error("ShowVariable VARIABLE field is not a variable field");
    }

    return field.getValue();
  }
}
