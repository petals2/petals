import type { SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
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

export class ChangeEffectBy extends BlockKind.Stack<"looks_changeeffectby"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_changeeffectby")
      throw new Error(`Expected opcode "looks_changeeffectby", got "${json.opcode}"`);

    if (json.fields.EFFECT == undefined)
      throw new Error("Expected field EFFECT on ChangeEffectBy");

    if (json.inputs.CHANGE == undefined)
      throw new Error("Expected input CHANGE on ChangeEffectBy");

    const value = Input.fromReference(context, serializedStore, json.inputs.CHANGE);

    return new ChangeEffectBy(json.fields.EFFECT[0] as Effect, value, ID);
  }

  constructor(effect: Effect = Effect.Color, change: Input | number = 25, ID?: string) {
    super("looks_changeeffectby", ID);

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
