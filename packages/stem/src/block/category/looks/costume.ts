import { Costume as CostumeValue } from "../../../costume";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class Costume extends BlockKind.Reporter {
  constructor(costume: CostumeValue | string) {
    super("looks_costume");

    this.setCostume(costume);
  }

  setCostume(costume: CostumeValue | string): this {
    this.setField("COSTUME", new ValueField(costume instanceof CostumeValue ? costume.getName() : costume));

    return this;
  }

  getCostume(): CostumeValue | string {
    const field = this.getField("COSTUME");

    if (!(field instanceof ValueField)) {
      throw new Error("Costume COSTUME field is not a value field");
    }

    return field.getValue() as CostumeValue | string;
  }
}
