import { ValueField } from "../../field/value";
import { Costume } from "../../../costume";
import { BlockKind } from "../../kinds";
import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class WhenBackdropSwitchesTo extends BlockKind.Hat<"event_whenbackdropswitchesto"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "event_whenbackdropswitchesto")
      throw new Error(`Expected opcode "event_whenbackdropswitchesto", got "${json.opcode}"`);

    if (json.fields.KEY_OPTION == undefined)
      throw new Error("Expected field KEY_OPTIONS on WhenBackdropSwitchesTo");

    return new WhenBackdropSwitchesTo(json.fields.KEY_OPTION[0] as string, ID);
  }

  constructor(backdrop: string, ID?: string) {
    super("event_whenbackdropswitchesto", ID);

    this.setBackdrop(backdrop);
  }

  setBackdrop(backdrop: Costume | string): this {
    this.setField("KEY_OPTION", new ValueField(backdrop instanceof Costume ? backdrop.getName() : backdrop));

    return this;
  }

  getBackdrop(): string {
    const field = this.getField("KEY_OPTION")!;

    if (!(field instanceof ValueField)) {
      throw new Error("WhenBackdropSwitchesTo KEY_OPTION field is not a value field");
    }

    return field.getValue() as string;
  }
}
