import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class WhenKeyPressed extends BlockKind.Hat<"event_whenkeypressed"> {
  constructor(keyOption: string) {
    super("event_whenkeypressed");

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
