import type { BlockStore, SerializedBlockStore } from "../..";
import type { Project, ProjectReference, SerializedBlock } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class CreateCloneOf extends BlockKind.Stack<"control_create_clone_of"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "argument_reporter_string_number")
      throw new Error(`Expected opcode "argument_reporter_string_number", got "${json.opcode}"`);

    if (json.inputs.CLONE_OPTION == undefined)
      throw new Error("Expected input CLONE_OPTION on CreateCloneOf");

    return new CreateCloneOf(Input.fromReference(context, serializedStore, json.inputs.CLONE_OPTION), ID);
  }

  constructor(cloneOption: Input, ID?: string) {
    super("control_create_clone_of", ID);

    this.setCloneOption(cloneOption);
  }

  setCloneOption(cloneOption: Input): this {
    cloneOption.link(this);

    this.setInput("CLONE_OPTION", cloneOption);

    return this;
  }

  getCloneOption(): Input {
    return this.getInput("CLONE_OPTION")!;
  }
}
