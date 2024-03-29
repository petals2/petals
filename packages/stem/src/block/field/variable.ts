import { Variable } from "../../variable";

export class VariableField {
  constructor(private readonly variable: Variable) {}

  serialize() { return <const> [this.variable.getName(), this.variable.getId()] }

  getValue() { return this.variable }
}
