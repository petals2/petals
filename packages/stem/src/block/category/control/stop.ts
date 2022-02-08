import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export enum StopOption {
  All = "all",
  ThisScript = "this script",
  OtherScripts = "other scripts in sprite",
}

export class Stop extends BlockKind.Stack<"control_stop"> {
  constructor(stopOption: StopOption) {
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
