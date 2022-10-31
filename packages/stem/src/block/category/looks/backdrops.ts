import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { Costume } from "../../../costume";
import { DeserializationContext } from "../../../project/deserializationContext";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class Backdrops extends BlockKind.Reporter<"looks_backdrops"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_backdropnumbername")
      throw new Error(`Expected opcode "looks_backdropnumbername", got "${json.opcode}"`);

    if (json.fields.BACKDROP == undefined)
      throw new Error("Expected field BACKDROP on Backdrops");

    return new Backdrops(json.fields.NUMBER_NAME[0] as "number" | "name", ID);
  }

  constructor(backdrop: Costume | string, ID?: string) {
    super("looks_backdrops", ID);

    this.setBackdrop(backdrop);
  }

  setBackdrop(backdrop: Costume | string): this {
    this.setField("BACKDROP", new ValueField(backdrop instanceof Costume ? backdrop.getName() : backdrop));

    return this;
  }

  getBackdrop(): Costume | string {
    const field = this.getField("BACKDROP");

    if (!(field instanceof ValueField)) {
      throw new Error("Backdrops BACKDROP field is not a value field");
    }

    return field.getValue() as Costume | string;
  }
}
