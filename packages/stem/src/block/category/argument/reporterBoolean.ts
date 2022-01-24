import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class ReporterBoolean extends BlockKind.Reporter {
  constructor(name: string) {
    super("argument_reporter_boolean");

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
