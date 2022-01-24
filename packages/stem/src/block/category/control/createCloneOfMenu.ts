import { Sprite } from "../../../target/sprite";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class CreateCloneOfMenu extends BlockKind.Stack {
  constructor(cloneOption: Sprite | "myself") {
    super("control_create_clone_of_menu");

    this.setCloneOption(cloneOption);
  }

  /**
   * @param cloneOption Sprite or string. The string "_myself_" is used to indicate the current sprite.
   * @returns Itself.
   */
  setCloneOption(cloneOption: Sprite | string): this {
    this.setField("CLONE_OPTION", new ValueField(
      cloneOption instanceof Sprite
        ? cloneOption.getName()
        : cloneOption
    ));

    return this;
  }

  /**
   * @returns Sprite or string. The string "_myself_" is used to indicate the current sprite.
   */
  getCloneOption(): string {
    const field = this.getField("CLONE_OPTION")!;

    if (!(field instanceof ValueField)) {
      throw new Error("CreateCloneOfMenu CLONE_OPTION field is not a value field");
    }

    return field.getValue() as string;
  }
}
