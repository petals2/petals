import { List } from "../../list/list";

export class ListField {
  constructor(private readonly list: List) {}

  serialize() { return <const> [this.list.getName(), this.list.getId()] }

  getValue() { return this.list }
}
