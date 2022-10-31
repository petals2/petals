import type { BlockStore, SerializedBlockStore } from "../..";
import type { Project, ProjectReference, SerializedBlock } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class ReporterBoolean extends BlockKind.Reporter<"argument_reporter_boolean"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "argument_reporter_boolean")
      throw new Error(`Expected opcode "argument_reporter_boolean", got "${json.opcode}"`);
  
    if (json.fields.VALUE == undefined)
      throw new Error("Expected field VALUE on ReporterBoolean");

    return new ReporterBoolean(json.fields.VALUE[0].toString(), ID)
  }

  constructor(name: string, ID?: string) {
    super("argument_reporter_boolean", ID);

    this.setName(name);
  }

  setName(name: string): this {
    this.setField("VALUE", new ValueField(name));
    return this;
  }

  getName(): string {
    const field = this.getField("VALUE");

    if (!(field instanceof ValueField)) {
      throw new Error("ReporterBoolean VALUE field is not a value field");
    }

    return field.getValue() as string;
  }
}
