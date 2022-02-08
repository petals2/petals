import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class SetRotationStyle extends BlockKind.Stack<"motion_setrotationstyle"> {
  constructor(style: "left-right" | "all around" | "don't rotate") {
    super("motion_setrotationstyle");

    this.setStyle(style);
  }

  setStyle(style: "left-right" | "all around" | "don't rotate") {
    this.setField("STYLE", new ValueField(style));
  }

  getStyle(): "left-right" | "all around" | "don't rotate" {
    const field = this.getField("STYLE");

    if (!(field instanceof ValueField)) {
      throw new Error("SetRotationStyle STYLE field is not a value field");
    }

    return field.getValue() as "left-right" | "all around" | "don't rotate";
  }
}
