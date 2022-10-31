import { Project } from "../../project";
import { DeserializationContext } from "../../project/deserializationContext";
import { ProjectReference } from "../../project/projectReference";
import { Costume, SerializedCostume } from "../costume";

export type SerializedCostumeStore = SerializedCostume[];

export class CostumeStore {
  private costumes: Costume[] = [];
  
  static async fromReference(context: DeserializationContext, json: SerializedCostumeStore) {
    const costumeStore = new CostumeStore;
    await costumeStore.deserialize(context, json);
    return costumeStore;
  }

  protected async deserialize(context: DeserializationContext, json: SerializedCostumeStore) {
    this.costumes = await Promise.all(json.map(json => Costume.fromReference(context, json)));
  }

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
