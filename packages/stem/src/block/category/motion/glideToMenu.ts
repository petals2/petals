import { Sprite } from "../../../target/sprite";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class GlideToMenu extends BlockKind.Reporter {
  constructor(to: Sprite | string = "_random_") {
    super("motion_glideto_menu");

    this.setTo(to);
  }

  setTo(to: Sprite | string): this {
    this.setField("TO", new ValueField(to instanceof Sprite ? to.getName() : to));

    return this;
  }

  getTo(): string {
    const field = this.getField("TO");

    if (!(field instanceof ValueField)) {
      throw new Error("GlideToMenu TO field is not a value field");
    }

    return field.getValue() as string;
  }
}
