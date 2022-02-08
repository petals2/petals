import { Sprite } from "../../../target/sprite";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class TouchingObjectMenu extends BlockKind.Reporter<"sensing_touchingobjectmenu"> {
  constructor(object: Sprite | string = "_mouse_") {
    super("sensing_touchingobjectmenu");

    this.setObject(object);
  }

  setObject(object: Sprite | string): this {
    this.setField("TOUCHINGOBJECTMENU", new ValueField(object instanceof Sprite ? object.getName() : object));

    return this;
  }

  getObject(): string {
    const field = this.getField("TOUCHINGOBJECTMENU");

    if (!(field instanceof ValueField)) {
      throw new Error("TouchingObjectMenu TOUCHINGOBJECTMENU field is not a value field");
    }

    return field.getValue() as string;
  }
}
