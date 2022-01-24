import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class GotoFrontBack extends BlockKind.Stack {
  constructor(frontBack: "front" | "back") {
    super("looks_gotofrontback");

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
