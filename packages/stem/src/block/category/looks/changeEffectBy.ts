import { ValueField } from "../../field/value";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export enum Effect {
  Color = "COLOR",
  Fisheye = "FISHEYE",
  Whirl = "WHIRL",
  Pixelate = "PIXELATE",
  Mosaic = "MOSAIC",
  Brightness = "BRIGHTNESS",
  Ghost = "GHOST",
}

export class ChangeEffectBy extends BlockKind.Stack {
  constructor(effect: Effect = Effect.Color, change: Input | number = 25) {
    super("looks_changeeffectby");

    this.setEffect(effect);
    this.setChange(change);
  }

  setEffect(effect: Effect): this {
    this.setField("EFFECT", new ValueField(effect));
    return this;
  }

  getEffect(): Effect {
    const field = this.getField("EFFECT")!;

    if (!(field instanceof ValueField)) {
      throw new Error("ChangeEffectBy EFFECT field is not a value field");
    }

    return field.getValue() as Effect;
  }

  setChange(value: Input | number): this {
    if (typeof value === "number") {
      value = Input.shadowed(new NumberInput(value));
    }

    value.link(this);

    this.setInput("CHANGE", value);

    return this;
  }

  getChange(): Input {
    return this.getInput("CHANGE")!;
  }
}
