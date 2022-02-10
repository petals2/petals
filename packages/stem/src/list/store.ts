import { List } from "./list"

export type SerializedListStore = Record<string, [name: string, values: string[]]>

export class ListStore {
  private _store: Map<string, List> = new Map();

  findListById(id: string): List | undefined {
    return this._store.get(id);
  }

  getListById(id: string): List {
    const result = this.findListById(id);

    if (result === undefined)
      throw new Error("Failed to find list by id: " + id);

    return result;
  }

  findListByName(name: string): List | undefined {
    for (const val of this._store.values()) {
      if (val.getName() == name) return val;
    }
  }

  getListByName(name: string): List {
    const result = this.findListByName(name);

    if (result === undefined) {
      throw new Error("Failed to find list by name: " + name);
    }

    return result;
  }

  createList(name: string, values: string[] = []): List {
    const list = new List(name, values);
    this._store.set(list.getId(), list);
    return list;
  }

  removeList(list: List): void {
    this.removeListById(list.getId());
  }

  removeListByName(name: string): void {
    const list = this.getListByName(name);

    this._store.delete(list.getId());
  }

  removeListById(id: string): void {
    if (!this._store.has(id))
      throw new Error("Failed to find list by id: " + id);

    this._store.delete(id);
  }

  serialize(): SerializedListStore {
    const result: SerializedListStore = {};

    for (const list of this._store.values()) {
      result[list.getId()] = [list.getName(), list.getValues()];
    }

    return result;
  }
}
