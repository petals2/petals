import { Sound } from "../../../sound";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class SoundsMenu extends BlockKind.Reporter {
  constructor(object: Sound | string) {
    super("sound_sounds_menu");

    this.setSound(object);
  }

  setSound(sound: Sound | string): this {
    this.setField("SOUND_MENU", new ValueField(sound instanceof Sound ? sound.getName() : sound));

    return this;
  }

  getSound(): string {
    const field = this.getField("SOUND_MENU");

    if (!(field instanceof ValueField)) {
      throw new Error("SoundsMenu SOUND_MENU field is not a value field");
    }

    return field.getValue() as string;
  }
}
