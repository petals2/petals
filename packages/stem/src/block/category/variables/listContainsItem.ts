import { List } from "../../../list";
import { ListField } from "../../field/list";
import { Input } from "../../input";
import { StringInput } from "../../input/string";
import { BlockKind } from "../../kinds";

export class ListContainsItem extends BlockKind.Boolean<"data_listcontainsitem"> {
  constructor(list: List, item: string | Input) {
    super("data_listcontainsitem");

    this.setList(list);
    this.setItem(item);
  }

  setList(list: List): this {
    this.setField("LIST", new ListField(list));
    return this;
  }

  getList(): List {
    const field = this.getField("LIST");

    if (!(field instanceof ListField)) {
      throw new Error("ListContainsItem LIST field is not a list field");
    }

    return field.getValue() as List;
  }

  setItem(item: string | Input): this {
    if (typeof item === "string") {
      item = Input.shadowed(new StringInput(item));
    }

    item.link(this);

    this.setInput("ITEM", item);

    return this;
  }

  getItem(): Input {
    return this.getInput("ITEM")!;
  }
}
