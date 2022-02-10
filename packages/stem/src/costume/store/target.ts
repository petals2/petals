import { CostumeStore } from "./store";

export class TargetCostumeStore extends CostumeStore {
  private selectedIndex: number = 0;

  getSelectedIndex(): number {
    return this.selectedIndex;
  };

  setSelectedIndex(index: number): this {
    this.selectedIndex = index;
    return this;
  };
}
