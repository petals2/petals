import { Variable } from "./variable";

export type SerializedVariableStore = Record<string, [name: string, values: string | number | boolean]>

export class VariableStore {
  private _store: Map<string, Variable> = new Map();

  static fromJson(json: SerializedVariableStore) {
    const variableStore = new VariableStore();
    variableStore.deserialize(json);
    return variableStore;
  }

  getVariables() {
    return this._store;
  }

  findVariableById(id: string): Variable | undefined {
    return this._store.get(id);
  }

  getVariableById(id: string): Variable {
    const result = this.findVariableById(id);

    if (result === undefined)
      throw new Error("Failed to find variable by id: " + id);

    return result;
  }

  findVariableByName(name: string): Variable | undefined {
    for (const val of this._store.values()) {
      if (val.getName() == name) return val;
    }
  }

  getVariableByName(name: string): Variable {
    const result = this.findVariableByName(name);

    if (result === undefined) {
      throw new Error("Failed to find variable by name: " + name);
    }

    return result;
  }

  createVariable(name: string, value: string | number | boolean): Variable {
    const variable = new Variable(name, value);
    this._store.set(variable.getId(), variable);
    return variable;
  }

  removeVariable(variable: Variable): void {
    this.removeVariableById(variable.getId());
  }

  removeVariableByName(name: string): void {
    const variable = this.getVariableByName(name);
    
    this._store.delete(variable.getId());
  }

  removeVariableById(id: string): void {
    if (!this._store.has(id))
      throw new Error("Failed to find variable by id: " + id);

    this._store.delete(id);
  }

  deserialize(json: SerializedVariableStore) {
    const jsonEntries = Object.entries(json);
    for (const [ variableId, [ variableName, variableValue ] ] of jsonEntries) {
      this._store.set(variableId, new Variable(variableName, variableValue));
    }
  }

  serialize(): SerializedVariableStore {
    const result: SerializedVariableStore = {};

    for (const variable of this._store.values()) {
      result[variable.getId()] = [variable.getName(), variable.getValue()];
    }

    return result;
  }
}
