import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export enum StopOption {
  All = "all",
  ThisScript = "this script",
  OtherScripts = "other scripts in sprite",
}

export class Stop extends BlockKind.Stack<"control_stop"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "control_stop")
    throw new Error(`Expected opcode "control_stop", got "${json.opcode}"`);

    if (json.fields.STOP_OPTION == undefined)
      throw new Error("Expected field STOP_OPTION on Stop");

    return new Stop(json.fields.STOP_OPTION[0] as StopOption, ID)
  }

  constructor(stopOption: StopOption, ID?: string) {
    super("control_stop");

    this.setStopOption(stopOption);
  }

  setStopOption(stopOption: StopOption): this {
    this.setField("STOP_OPTION", new ValueField(stopOption));
    return this;
  }

  getStopOption(): StopOption {
    const field = this.getField("STOP_OPTION")!;

    if (!(field instanceof ValueField)) {
      throw new Error("Stop STOP_OPTION field is not a value field");
    }

    return field.getValue() as StopOption;
  }
}
