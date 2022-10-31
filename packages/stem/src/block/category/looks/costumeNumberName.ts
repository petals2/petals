import { SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class CostumeNumberName extends BlockKind.Reporter<"looks_costumenumbername"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_costumenumbername")
      throw new Error(`Expected opcode "looks_costumenumbername", got "${json.opcode}"`);

    if (json.fields.NUMBER_NAME == undefined)
      throw new Error("Expected field NUMBER_NAME on CostumeNumberName");

    return new CostumeNumberName(json.fields.NUMBER_NAME[0] as "number" | "name", ID);
  }

  constructor(numberName: "number" | "name" = "number", ID?: string) {
    super("looks_costumenumbername", ID);

    this.setNumberName(numberName);
  }

  setNumberName(numberName: "number" | "name") {
    this.setField("NUMBER_NAME", new ValueField(numberName));
  }

  getNumberName(): "number" | "name" {
    const field = this.getField("NUMBER_NAME")!;

    if (!(field instanceof ValueField)) {
      throw new Error("CostumeNumberName NUMBER_NAME field is not a value field");
    }

    return field.getValue() as "number" | "name";
  }
}
