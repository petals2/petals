import { ValueField } from "../../field/value";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export enum Effect {
  Pitch = "PITCH",
  Pan = "PAN",
}

export class ChangeEffectBy extends BlockKind.Stack<"sound_changeeffectby"> {
  constructor(effect: Effect = Effect.Pitch, value: Input | number = 10) {
    super("sound_changeeffectby");

    this.setEffect(effect);
    this.setValue(value);
  }

  setEffect(effect: Effect): this {
    this.setField("EFFECT", new ValueField(effect));
    return this;
  }

  getEffect(): Effect {
    const field = this.getField("EFFECT")!;

    if (!(field instanceof ValueField)) {
      throw new Error("SetEffectTo EFFECT field is not a value field");
    }

    return field.getValue() as Effect;
  }

  setValue(value: Input | number): this {
    if (typeof value === "number") {
      value = Input.shadowed(new NumberInput(value));
    }

    value.link(this);

    this.setInput("VALUE", value);

    return this;
  }

  getValue(): Input {
    return this.getInput("VALUE")!;
  }
}
