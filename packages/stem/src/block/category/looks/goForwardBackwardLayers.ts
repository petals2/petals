import { SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { ValueField } from "../../field/value";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class GoForwardBackwardLayers extends BlockKind.Stack<"looks_goforwardbackwardlayers"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_goforwardbackwardlayers")
      throw new Error(`Expected opcode "looks_goforwardbackwardlayers", got "${json.opcode}"`);

    if (json.fields.FORWARD_BACKWARD == undefined)
      throw new Error("Expected field FORWARD_BACKWARD on GoForwardBackwardLayers");

    if (json.inputs.NUM == undefined)
      throw new Error("Expected input NUM on GoForwardBackwardLayers")

    const num = Input.fromReference(context, serializedStore, json.inputs.NUM)

    return new GoForwardBackwardLayers(json.fields.FORWARD_BACKWARD[0] as "forward" | "backward", num, ID);
  }

  constructor(forwardBackward: "forward" | "backward" = "forward", num: Input | number = 1, ID?: string) {
    super("looks_goforwardbackwardlayers", ID);

    this.setForwardBackward(forwardBackward);
    this.setNum(num);
  }

  setForwardBackward(forwardBackward: "forward" | "backward"): this {
    this.setField("FORWARD_BACKWARD", new ValueField(forwardBackward));

    return this;
  }

  getForwardBackward(): "forward" | "backward" {
    const field = this.getField("FORWARD_BACKWARD");

    if (!(field instanceof ValueField)) {
      throw new Error("GoForwardBackwardLayers FORWARD_BACKWARD field is not a value field");
    }

    return field.getValue() as "forward" | "backward";
  }

  setNum(num: Input | number): this {
    if (typeof num === "number") {
      num = Input.shadowed(new NumberInput(num));
    }

    // block checking
    num.link(this);

    this.setInput("NUM", num);

    return this;
  }

  getNum(): Input {
    return this.getInput("NUM")!;
  }
}
