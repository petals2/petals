import { SerializedBlock, SerializedBlockStore } from "../../..";
import { Costume as CostumeValue } from "../../../costume";
import { DeserializationContext } from "../../../project/deserializationContext";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class Costume extends BlockKind.Reporter<"looks_costume"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_cleargraphiceffects")
      throw new Error(`Expected opcode "looks_cleargraphiceffects", got "${json.opcode}"`);

    if (json.fields.COSTUME == undefined) {
      throw new Error("Expected field COSTUME on Costume")
    }

    return new Costume(json.fields.COSTUME[0] as string, ID);
  }

  constructor(costume: CostumeValue | string, ID?: string) {
    super("looks_costume", ID);

    this.setCostume(costume);
  }

  setCostume(costume: CostumeValue | string): this {
    this.setField("COSTUME", new ValueField(costume instanceof CostumeValue ? costume.getName() : costume));

    return this;
  }

  getCostume(): CostumeValue | string {
    const field = this.getField("COSTUME");

    if (!(field instanceof ValueField)) {
      throw new Error("Costume COSTUME field is not a value field");
    }

    return field.getValue() as CostumeValue | string;
  }
}
