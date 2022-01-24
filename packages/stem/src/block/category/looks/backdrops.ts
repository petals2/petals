import { Costume } from "../../../costume";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class Backdrops extends BlockKind.Reporter {
  constructor(backdrop: Costume | string) {
    super("looks_backdrops");

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
