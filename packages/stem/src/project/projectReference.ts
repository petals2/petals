import { SerializedProject } from ".";

export interface ProjectReference {
  getJson(): Promise<SerializedProject>;
  getAsset(fileName: string): Promise<Buffer | undefined>;
}
