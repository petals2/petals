import { SerializedBlockStore, SerializedBlock } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class SwitchCostumeTo extends BlockKind.Stack<"looks_switchcostumeto"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_switchcostumeto")
      throw new Error(`Expected opcode "looks_switchcostumeto", got "${json.opcode}"`);

    if (json.inputs.COSTUME == undefined)
      throw new Error("Expected input COSTUME on SwitchCostumeTo")

    const costume = Input.fromReference(context, serializedStore, json.inputs.COSTUME);

    return new SwitchCostumeTo(costume, ID);
  }

  constructor(costume: Input, ID?: string) {
    super("looks_switchcostumeto", ID);

    this.setCostume(costume);
  }
  
  setCostume(costume: Input): this {
    costume.link(this);

    this.setInput("COSTUME", costume);

    return this;
  }

  getCostume(): Input {
    return this.getInput("COSTUME")!;
  }
}
