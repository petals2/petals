import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class WhenKeyPressed extends BlockKind.Hat<"event_whenkeypressed"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "event_whenkeypressed")
      throw new Error(`Expected opcode "event_whenkeypressed", got "${json.opcode}"`);

    if (json.fields.KEY_OPTION == undefined)
      throw new Error("Expected field KEY_OPTION on WhenKeyPressed");

    return new WhenKeyPressed(json.fields.KEY_OPTION[0] as string, ID);
  }

  constructor(keyOption: string, ID?: string) {
    super("event_whenkeypressed", ID);

    this.setKeyOption(keyOption);
  }

  setKeyOption(keyOption: string): this {
    this.setField("KEY_OPTION", new ValueField(keyOption));

    return this;
  }

  getKeyOption(): string {
    const field = this.getField("KEY_OPTION")!;

    if (!(field instanceof ValueField)) {
      throw new Error("WhenKeyPressed KEY_OPTION field is not a value field");
    }

    return field.getValue() as string;
  }
}
