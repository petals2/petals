import { SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class GotoFrontBack extends BlockKind.Stack<"looks_gotofrontback"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_gotofrontback")
      throw new Error(`Expected opcode "looks_gotofrontback", got "${json.opcode}"`);

    if (json.fields.FRONT_BACK == undefined)
      throw new Error("Expected field FRONT_BACK on GotoFrontBack");


    return new GotoFrontBack(json.fields.FORWARD_BACKWARD[0] as "front" | "back", ID);
  }

  constructor(frontBack: "front" | "back", ID?: string) {
    super("looks_gotofrontback", ID);

    this.setFrontBack(frontBack);
  }

  setFrontBack(frontBack: "front" | "back"): this {
    this.setField("FRONT_BACK", new ValueField(frontBack));
    return this;
  }

  getFrontBack(): "front" | "back" {
    const field = this.getField("FRONT_BACK");

    if (!(field instanceof ValueField)) {
      throw new Error("GotoFrontBack FRONT_BACK field is not a value field");
    }

    return field.getValue() as "front" | "back";
  }
}
