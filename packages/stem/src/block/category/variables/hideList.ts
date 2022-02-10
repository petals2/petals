import { ListField } from "../../field/list";
import { List } from "../../../list/list";
import { BlockKind } from "../../kinds";

export class HideList extends BlockKind.Stack<"data_hidelist"> {
  constructor(list: List) {
    super("data_hidelist");

    this.setList(list);
  }

  setList(list: List): this {
    this.setField("LIST", new ListField(list));
    return this;
  }

  getList(): List {
    const field = this.getField("LIST");

    if (!(field instanceof ListField)) {
      throw new Error("HideList LIST field is not a list field");
    }

    return field.getValue() as List;
  }
}
