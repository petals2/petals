import { SerializedBlockStore, SerializedBlock } from "../..";
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

export class SetEffectTo extends BlockKind.Stack<"looks_seteffectto"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_seteffectto")
      throw new Error(`Expected opcode "looks_seteffectto", got "${json.opcode}"`);

    if (json.fields.EFFECT == undefined)
      throw new Error("Expected input EFFECT on SetEffectTo")

    if (json.inputs.VALUE == undefined)
      throw new Error("Expected input VALUE on SetEffectTo")

    const value = Input.fromReference(context, serializedStore, json.inputs.VALUE);

    return new SetEffectTo(json.fields.EFFECT[0] as Effect, value, ID);
  }

  constructor(effect: Effect = Effect.Color, value: Input | number = 25, ID?: string) {
    super("looks_seteffectto", ID);

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
