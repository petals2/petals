import type { BlockStore, SerializedBlockStore } from "../..";
import type { Project, ProjectReference, SerializedBlock } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { Sprite } from "../../../target/sprite";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class CreateCloneOfMenu extends BlockKind.Stack<"control_create_clone_of_menu"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "control_create_clone_of_menu")
      throw new Error(`Expected opcode "control_create_clone_of_menu", got "${json.opcode}"`);

    if (json.fields.CLONE_OPTION == undefined)
      throw new Error("Expected field CLONE_OPTION on CreateCloneOfMenu");

    return new CreateCloneOfMenu(json.fields.CLONE_OPTION[0].toString(), ID)
  }

  constructor(cloneOption: Sprite | string, ID?: string) {
    super("control_create_clone_of_menu", ID);

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
