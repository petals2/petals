import { NumberInput } from "../../input/number";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";
import { DeserializationContext } from "../../../project/deserializationContext";
import { SerializedBlock, SerializedBlockStore } from "../../..";

export class ChangeSizeBy extends BlockKind.Stack<"looks_changesizeby"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_changesizeby")
      throw new Error(`Expected opcode "looks_changesizeby", got "${json.opcode}"`);

    if (json.inputs.CHANGE == undefined)
      throw new Error("Expected input CHANGE on ChangeSizeBy");

    const value = Input.fromReference(context, serializedStore, json.inputs.CHANGE);

    return new ChangeSizeBy(value, ID);
  }

  constructor(change: Input | number = 10, ID?: string) {
    super("looks_changesizeby", ID);

    this.setChange(change);
  }

  setChange(change: Input | number): this {
    if (typeof change === "number") {
      change = Input.shadowed(new NumberInput(change));
    }

    // block checking
    change.link(this);

    this.setInput("CHANGE", change);

    return this;
  }

  getChange(): Input {
    return this.getInput("CHANGE")!;
  }
}
