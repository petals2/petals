import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class CostumeNumberName extends BlockKind.Reporter<"looks_costumenumbername"> {
  constructor(numberName: "number" | "name" = "number") {
    super("looks_costumenumbername");

    this.setNumberName(numberName);
  }

  setNumberName(numberName: "number" | "name") {
    this.setField("NUMBER_NAME", new ValueField(numberName));
  }

  getNumberName(): "number" | "name" {
    const field = this.getField("NUMBER_NAME")!;

    if (!(field instanceof ValueField)) {
      throw new Error("CostumeNumberName NUMBER_NAME field is not a value field");
    }

    return field.getValue() as "number" | "name";
  }
}
