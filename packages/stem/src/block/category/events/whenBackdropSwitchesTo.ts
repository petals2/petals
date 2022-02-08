import { ValueField } from "../../field/value";
import { Costume } from "../../../costume";
import { BlockKind } from "../../kinds";

export class WhenBackdropSwitchesTo extends BlockKind.Hat<"event_whenbackdropswitchesto"> {
  constructor(backdrop: string) {
    super("event_whenbackdropswitchesto");

    this.setBackdrop(backdrop);
  }

  setBackdrop(backdrop: Costume | string): this {
    this.setField("KEY_OPTION", new ValueField(backdrop instanceof Costume ? backdrop.getName() : backdrop));

    return this;
  }

  getBackdrop(): string {
    const field = this.getField("KEY_OPTION")!;

    if (!(field instanceof ValueField)) {
      throw new Error("WhenBackdropSwitchesTo KEY_OPTION field is not a value field");
    }

    return field.getValue() as string;
  }
}
