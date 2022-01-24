import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export enum CurrentOption {
  Year = "year",
  Month = "month",
  Date = "date",
  DayOfWeek = "dayofweek",
  Hour = "hour",
  Minutes = "minute",
  Second = "second",
}

export class Current extends BlockKind.Reporter {
  constructor(current: CurrentOption = CurrentOption.Year) {
    super("sensing_current");

    this.setCurrent(current);
  }

  setCurrent(current: CurrentOption): this {
    this.setField("CURRENTMENU", new ValueField(current));

    return this;
  }

  getObject(): CurrentOption {
    const field = this.getField("CURRENTMENU");

    if (!(field instanceof ValueField)) {
      throw new Error("Current CURRENTMENU field is not a value field");
    }

    return field.getValue() as CurrentOption;
  }
}
