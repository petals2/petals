import { SerializedBlockStore } from "..";
import type { BlockStore, Project, ProjectReference } from "../..";
import { DeserializationContext } from "../../project/deserializationContext";
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
export type SerializedInput = [InputKind, SerializedAnyInput | null] | [InputKind, SerializedAnyInput, SerializedAnyInput];

export enum InputKind {
  Shadowed = 1,
  Unshadowed,
  Obscured
}

export class Input {
  static anyFromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedAnyInput): AnyInput {
    if (typeof json === "string") {
      let result = context.getCurrentBlockStore()!.findBlockById(json);

      if (result === undefined) {
        result = Block.fromReference(context, serializedStore, serializedStore[json]);
      }

      return result;
    }

    switch(json[0]) {
      case 4: return new NumberInput(json[1]);
      case 5: return new PositiveNumberInput(json[1]);
      case 6: return new PositiveIntegerInput(json[1]);
      case 7: return new IntegerInput(json[1]);
      case 8: return new AngleInput(json[1]);
      case 9: return new ColorInput(json[1]);
      case 10: return new StringInput(json[1]);
      case 11:
        const broadcast = context.getProject().getTargets().getStage().getBroadcasts().findBroadcastById(json[2]);

        if (!broadcast)
          throw new Error(`Could not find broadcast with id "${json[2]}" and name "${json[1]}"`);

        if (broadcast.getName() != json[1])
          throw new Error(`Broadcast with if "${json[2]}" did not match (requested: "${json[1]}", has: "${broadcast.getName()}")`)

        return new BroadcastInput(broadcast);
      case 12:
        const variable = context.getProject().getTargets().getStage().getVariables().findVariableById(json[2]);

        if (!variable || variable.getName() != json[1])
          throw new Error(`Could not find variable with id "${json[2]}" and name "${json[1]}"`);

        return new VariableInput(variable);
      case 13:
        const list = context.getProject().getTargets().getStage().getLists().findListById(json[2]);

        if (!list || list.getName() != json[1])
          throw new Error(`Could not find list with id "${json[2]}" and name "${json[1]}"`);

        return new ListInput(list);
    }
  }

  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedInput): Input {
    const [kind, topLayer, bottomLayer] = json;

    return new Input(
      kind,
      topLayer ? Input.anyFromReference(context, serializedStore, topLayer) : undefined,
      bottomLayer ? Input.anyFromReference(context, serializedStore, bottomLayer) : undefined
    );
  }

  static shadowed(value: AnyInput): Input {
    return new Input(InputKind.Shadowed, value);
  }

  static unshadowed(value: AnyInput): Input {
    return new Input(InputKind.Unshadowed, value);
  }

  static obscured(value: AnyInput, obscured: AnyInput): Input {
    return new Input(InputKind.Obscured, value, obscured);
  }

  private constructor(protected readonly kind: number, protected topLayer: AnyInput | undefined, protected bottomLayer?: AnyInput) {}

  getTopLayer(): AnyInput | undefined { return this.topLayer }
  setTopLayer(value: AnyInput | undefined): this { this.topLayer = value; return this }
  getBottomLayer(): AnyInput | undefined { return this.bottomLayer }
  setBottomLayer(value: AnyInput | undefined): this { this.bottomLayer = value; return this }

  link(block: Block) {
    if (this.topLayer instanceof Block) this.topLayer.setParent(block);
    if (this.bottomLayer instanceof Block) this.bottomLayer.setParent(block);
  }

  serialize(): [number, SerializedAnyInput | null] | [number, SerializedAnyInput, SerializedAnyInput] {
    if (this.topLayer === undefined) {
      return [this.kind, null]
    }
    
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
