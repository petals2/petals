import { SerializedCostumeStore } from ".";
import { Project, Sb3 } from "../..";
import { CostumeStore } from "./store";

export class TargetCostumeStore extends CostumeStore {
  private selectedIndex: number = 0;

  static async fromSb3(project: Project, sb3: Sb3, json: SerializedCostumeStore) {
    const costumeStore = new TargetCostumeStore;
    await costumeStore.deserialize(project, sb3, json);
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
