import { Project } from "..";
import type { DeserializationContext } from "../project/deserializationContext";
import { ProjectReference } from "../project/projectReference";
import { SerializedSprite, Sprite } from "./sprite";
import { SerializedStage, Stage } from "./stage";

export type SerializedTarget = SerializedStage | SerializedSprite;
export type SerializedTargetStore = SerializedTarget[];

export class TargetStore {
  private _store: (Stage | Sprite)[] = [new Stage()];

  static async fromReference(context: DeserializationContext, json: SerializedTargetStore) {
    const targetStore = new TargetStore;
    await targetStore.deserialize(context, json);
    return targetStore;
  }

  findSpriteByName(name: string): Sprite | undefined {
    for (const val of this._store) {
      if (!val.isSprite()) continue;
      if (val.getName() === name) return val;
    }
  }

  getSpriteByName(name: string): Sprite {
    const result = this.findSpriteByName(name);

    if (result === undefined) {
      throw new Error("Failed to find target by name: " + name);
    }

    return result;
  }

  createSprite(name: string): Sprite {
    const sprite = new Sprite(name);
    this._store.push(sprite);
    return sprite;
  }

  removeSpriteByName(name: string): void {
    const sprite = this.getSpriteByName(name);

    this._store = this._store.filter(val => val !== sprite);
  }

  findStage(): Stage | undefined {
    for (const val of this._store) {
      if (!val.isStage()) continue;
      return val;
    }
  }

  getStage(): Stage {
    const result = this.findStage();

    if (result === undefined) {
      throw new Error("Failed to find stage");
    }

    return result;
  }

  setStage(stage: Stage) {
    for (let i = 0; i < this._store.length; i++) {
      if (this._store[i].isStage()) {
        this._store[i] = stage;
        return;
      }
    }
    this._store.push(stage);
  }

  getSprites(): Sprite[] {
    return this._store.filter(val => val.isSprite()) as Sprite[];
  }

  getTargets(): (Stage | Sprite)[] {
    return this._store;
  }

  protected async deserialize(context: DeserializationContext, json: SerializedTargetStore) {
    const stage = await Stage.fromReference(context, json.find(target => target.isStage)! as SerializedStage);

    this._store = await Promise.all(json.map(target => {
      if (target.isStage) return stage;

      return Sprite.fromReference(context, target as SerializedSprite);
    }));
  }

  serialize(): SerializedTargetStore {
    return this._store.map(e => e.serialize());
  }
}
