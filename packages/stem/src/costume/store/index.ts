import { Costume, SerializedCostume } from "..";

export type SerializedCostumeStore = SerializedCostume[];

export class CostumeStore {
  private costumes: Costume[] = [];

  serialize(): SerializedCostumeStore {
    return this.costumes.map(costume => costume.serialize());
  }

  addCostume(costume: Costume): void {
    this.costumes.push(costume);
  }

  getCostumes(): Costume[] {
    return this.costumes;
  }

  findCostume(hash: string): Costume | undefined {
    return this.costumes.find(costume => costume.getMd5Hash() === hash);
  }

  getCostume(hash: string): Costume {
    const result = this.findCostume(hash);

    if (result === undefined)
      throw new Error("Failed to find costume by hash: " + hash);

    return result;
  }

  findCostumeByName(name: string): Costume | undefined {
    return this.costumes.find(costume => costume.getName() === name);
  }

  getCostumeByName(name: string): Costume {
    const result = this.findCostumeByName(name);

    if (result === undefined)
      throw new Error("Failed to find costume by name: " + name);

    return result;
  }

  removeCostume(costume: Costume): void {
    this.removeCostumeByHash(costume.getMd5Hash());
  }

  removeCostumeByHash(hash: string): void {
    const index = this.costumes.findIndex(c => c.getMd5Hash() === hash);

    if (index === -1)
      throw new Error("Failed to find costume by hash: " + hash);

    this.costumes.splice(index, 1);
  }
  
}
