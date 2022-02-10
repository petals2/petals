import { List } from "../../../list/list";
import { ListField } from "../../field/list";
import { BlockKind } from "../../kinds";

export class LengthOfList extends BlockKind.Reporter<"data_lengthoflist"> {
  constructor(list: List) {
    super("data_lengthoflist");

    this.setList(list);
  }

  setList(list: List): this {
    this.setField("LIST", new ListField(list));
    return this;
  }

  getList(): List {
    const field = this.getField("LIST");

    if (!(field instanceof ListField)) {
      throw new Error("LengthOfList LIST field is not a list field");
    }

    return field.getValue() as List;
  }
}
