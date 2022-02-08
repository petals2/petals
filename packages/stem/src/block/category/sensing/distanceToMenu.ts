import { Sprite } from "../../../target/sprite";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class DistanceToMenu extends BlockKind.Reporter<"sensing_distancetomenu"> {
  constructor(object: Sprite | string = "_mouse_") {
    super("sensing_distancetomenu");

    this.setObject(object);
  }

  setObject(object: Sprite | string = "_mouse_"): this {
    this.setField("DISTANCETOMENU", new ValueField(object instanceof Sprite ? object.getName() : object));

    return this;
  }

  getObject(): string {
    const field = this.getField("DISTANCETOMENU");

    if (!(field instanceof ValueField)) {
      throw new Error("DistanceToMenu DISTANCETOMENU field is not a value field");
    }

    return field.getValue() as string;
  }
}
