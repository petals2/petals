import { SerializedCostumeStore } from ".";
import { Project } from "../..";
import { ProjectReference } from "../../project/projectReference";
import { CostumeStore } from "./store";

export class TargetCostumeStore extends CostumeStore {
  private selectedIndex: number = 0;

  static async fromReference(project: Project, reference: ProjectReference, json: SerializedCostumeStore) {
    const costumeStore = new TargetCostumeStore;
    await costumeStore.deserialize(project, reference, json);
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
