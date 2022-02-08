import { Sprite } from "../../../target/sprite";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class PointTowardsMenu extends BlockKind.Reporter<"motion_pointtowards_menu"> {
  constructor(towards: Sprite | string = "_mouse_") {
    super("motion_pointtowards_menu");

    this.setTowards(towards);
  }

  setTowards(towards: Sprite | string): this {
    this.setField("TOWARDS", new ValueField(towards instanceof Sprite ? towards.getName() : towards));

    return this;
  }

  getTowards(): string {
    const field = this.getField("TOWARDS");

    if (!(field instanceof ValueField)) {
      throw new Error("PointTowardsMenu TOWARDS field is not a value field");
    }

    return field.getValue() as string;
  }
}
