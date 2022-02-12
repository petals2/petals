import { Project, Sb3 } from "..";
import { Broadcast } from "./broadcast";

export type SerializedBroadcastStore = Record<string, string>;

export class BroadcastStore {
  private _store: Map<string, Broadcast> = new Map();

  static fromReference(project: Project, reference: ProjectReference, json: SerializedBroadcastStore) {
    const broadcastStore = new BroadcastStore;
    broadcastStore.deserialize(project, sb3, json);
    return broadcastStore;
  }

  findBroadcastById(id: string): Broadcast | undefined {
    return this._store.get(id);
  }

  getBroadcastById(id: string): Broadcast {
    const result = this.findBroadcastById(id);

    if (result === undefined)
      throw new Error("Failed to find broadcast by id: " + id);

    return result;
  }

  findBroadcastByName(name: string): Broadcast | undefined {
    for (const val of this._store.values()) {
      if (val.getName() === name) return val;
    }
  }

  getBroadcastByName(name: string): Broadcast {
    const result = this.findBroadcastByName(name);

    if (result === undefined) {
      throw new Error("Failed to find broadcast by name: " + name);
    }

    return result;
  }

  createBroadcast(name: string): Broadcast {
    const broadcast = new Broadcast(name);
    this._store.set(broadcast.getId(), broadcast);
    return broadcast;
  }

  removeBroadcast(broadcast: Broadcast): void {
    this.removeBroadcastById(broadcast.getId());
  }

  removeBroadcastByName(name: string): void {
    const broadcast = this.getBroadcastByName(name);

    this._store.delete(broadcast.getId());
  }

  removeBroadcastById(id: string): void {
    if (!this._store.has(id))
      throw new Error("Failed to find broadcast by id: " + id);

    this._store.delete(id);
  }

  protected deserialize(project: Project, reference: ProjectReference, json: SerializedBroadcastStore) {
    const entries = Object.entries(json);
    this._store.clear();
    for (const [ broadcastId, broadcastName ] of entries) {
      this._store.set(broadcastId, new Broadcast(broadcastName));
    }
  }

  serialize(): SerializedBroadcastStore {
    const result: SerializedBroadcastStore = {};

    for (const broadcast of this._store.values()) {
      result[broadcast.getId()] = broadcast.getName();
    }

    return result;
  }
}
