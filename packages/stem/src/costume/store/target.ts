import { SerializedCostumeStore } from ".";
import { Project } from "../..";
import { DeserializationContext } from "../../project/deserializationContext";
import { ProjectReference } from "../../project/projectReference";
import { CostumeStore } from "./store";

export class TargetCostumeStore extends CostumeStore {
  private selectedIndex: number = 0;

  static async fromReference(context: DeserializationContext, json: SerializedCostumeStore) {
    const costumeStore = new TargetCostumeStore;
    await costumeStore.deserialize(context, json);
    return costumeStore;
  }

  getSelectedIndex(): number {
    return this.selectedIndex;
  };

  setSelectedIndex(index: number): this {
    this.selectedIndex = index;
    return this;
  };
}
