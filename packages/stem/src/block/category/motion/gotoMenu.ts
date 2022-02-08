import { Sprite } from "../../../target/sprite";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class GotoMenu extends BlockKind.Reporter<"motion_goto_menu"> {
  constructor(to: Sprite | string = "_random_") {
    super("motion_goto_menu");

    this.setTo(to);
  }

  setTo(to: Sprite | string): this {
    this.setField("TO", new ValueField(to instanceof Sprite ? to.getName() : to));

    return this;
  }

  getTo(): string {
    const field = this.getField("TO");

    if (!(field instanceof ValueField)) {
      throw new Error("GotoMenu TO field is not a value field");
    }

    return field.getValue() as string;
  }
}
