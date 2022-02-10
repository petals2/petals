import { Block } from "../block";
import { AngleInput } from "./angle";
import { BroadcastInput } from "./broadcast";
import { ColorInput } from "./color";
import { IntegerInput } from "./integer";
import { ListInput } from "./list";
import { NumberInput } from "./number";
import { PositiveIntegerInput } from "./positiveInteger";
import { PositiveNumberInput } from "./positiveNumber";
import { StringInput } from "./string";
import { VariableInput } from "./variable";

export type AnyInput = Block | NumberInput | PositiveNumberInput | PositiveIntegerInput | IntegerInput | AngleInput | ColorInput | StringInput | BroadcastInput | VariableInput | ListInput;
type SerializedAnyInput = string | ReturnType<Exclude<AnyInput, Block>["serialize"]>;
export type SerializedInput = [number, SerializedAnyInput] | [number, SerializedAnyInput, SerializedAnyInput];

export enum InputKind {
  Shadowed = 1,
  Unshadowed,
  Obscured
}

export class Input {
  static shadowed(value: AnyInput): Input {
    return new Input(InputKind.Shadowed, value);
  }

  static unshadowed(value: AnyInput): Input {
    return new Input(InputKind.Unshadowed, value);
  }

  static obscured(value: AnyInput, obscured: AnyInput): Input {
    return new Input(InputKind.Obscured, value, obscured);
  }

  private constructor(protected readonly kind: number, protected topLayer: AnyInput, protected bottomLayer?: AnyInput) {}

  getTopLayer(): AnyInput { return this.topLayer }
  setTopLayer(value: AnyInput): this { this.topLayer = value; return this }
  getBottomLayer(): AnyInput | undefined { return this.bottomLayer }
  setBottomLayer(value: AnyInput | undefined): this { this.bottomLayer = value; return this }

  link(block: Block) {
    if (this.topLayer instanceof Block) this.topLayer.setParent(block);
    if (this.bottomLayer instanceof Block) this.bottomLayer.setParent(block);
  }

  serialize(): [number, SerializedAnyInput] | [number, SerializedAnyInput, SerializedAnyInput] {
    if (this.bottomLayer === undefined) {
      return [this.kind, "getId" in this.topLayer ? this.topLayer.getId() : this.topLayer.serialize()];
    }

    return [
      this.kind,
      "getId" in this.topLayer ? this.topLayer.getId() : this.topLayer.serialize(),
      "getId" in this.bottomLayer ? this.bottomLayer.getId() : this.bottomLayer.serialize()
    ];
  }
}
