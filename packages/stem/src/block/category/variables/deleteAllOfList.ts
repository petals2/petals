import { ListField } from "../../field/list";
import { List } from "../../../list";
import { BlockKind } from "../../kinds";

export class DeleteAllOfList extends BlockKind.Stack {
  constructor(list: List) {
    super("data_deletealloflist");

    this.setList(list);
  }

  setList(list: List): this {
    this.setField("LIST", new ListField(list));
    return this;
  }

  getList(): List {
    const field = this.getField("LIST");

    if (!(field instanceof ListField)) {
      throw new Error("DeleteAllOfList LIST field is not a list field");
    }

    return field.getValue() as List;
  }
}
