import { SerializedBlockStore, SerializedBlock } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class ChangeXBy extends BlockKind.Stack<"motion_changexby"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "motion_changexby")
      throw new Error(`Expected opcode "motion_changexby", got "${json.opcode}"`);

    if (json.inputs.DX == undefined)
      throw new Error("Expected input DX on ChangeXBy")

    const dx = Input.fromReference(context, serializedStore, json.inputs.DX);

    return new ChangeXBy(dx, ID);
  }

  constructor(dX: number | Input = 10, ID?: string) {
    super("motion_changexby", ID);

    this.setDx(dX);
  }

  setDx(dX: number | Input): this {
    if (typeof dX === "number") {
      dX = Input.shadowed(new NumberInput(dX));
    }

    // block checking
    dX.link(this);

    this.setInput("DX", dX);

    return this;
  }

  getDx(): Input {
    return this.getInput("DX")!;
  }
}
