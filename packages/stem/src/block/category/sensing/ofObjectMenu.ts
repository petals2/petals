import { Sprite } from "../../../target/sprite";
import { Stage } from "../../../target/stage";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class OfObjectMenu extends BlockKind.Reporter<"sensing_of_object_menu"> {
  constructor(object: Sprite | Stage | string = "_stage_") {
    super("sensing_of_object_menu");

    this.setObject(object);
  }

  setObject(object: Sprite | Stage | string): this {
    this.setField("OBJECT", new ValueField(object instanceof Sprite ? object.getName() : object instanceof Stage ? "_stage_" : object));

    return this;
  }

  getObject(): string {
    const field = this.getField("OBJECT");

    if (!(field instanceof ValueField)) {
      throw new Error("OfObjectMenu OBJECT field is not a value field");
    }

    return field.getValue() as string;
  }
}
