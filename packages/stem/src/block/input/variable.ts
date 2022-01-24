import { Variable } from "../../variable";

export type SerializedVariableInput = [12, string, string];

export class VariableInput {
  constructor(protected val: Variable) { }

  serialize(): SerializedVariableInput { return [12, this.val.getName(), this.val.getId()] }

  getValue(): Variable { return this.val }
}
