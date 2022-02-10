import { ListField } from "../../field/list";
import { List } from "../../../list/list";
import { BlockKind } from "../../kinds";

export class ShowList extends BlockKind.Stack<"data_showlist"> {
  constructor(list: List) {
    super("data_showlist");

    this.setList(list);
  }

  setList(list: List): this {
    this.setField("LIST", new ListField(list));
    return this;
  }

  getList(): List {
    const field = this.getField("LIST");

    if (!(field instanceof ListField)) {
      throw new Error("ShowList LIST field is not a list field");
    }

    return field.getValue() as List;
  }
}
