import { BroadcastStore } from "../broadcast/store";
import { VariableStore } from "../variable/store";
import { ListStore } from "../list/store";
import { BlockStore } from "../block/store";
import { CommentStore } from "../comment/store";
import { TargetCostumeStore } from "../costume/store/target";
import { SoundStore } from "../sound/store";
import type { Sprite } from "./sprite";
import type { Stage } from "./stage";
import { Asset } from "../asset";

export abstract class Target {
  protected broadcasts: BroadcastStore = new BroadcastStore();
  protected variables: VariableStore = new VariableStore();
  protected lists: ListStore = new ListStore();
  protected blocks: BlockStore = new BlockStore();
  protected comments: CommentStore = new CommentStore();
  protected costumes: TargetCostumeStore = new TargetCostumeStore();
  protected sounds: SoundStore = new SoundStore();
  protected layer: number = 0;
  protected volumeMultiplier: number = 1;

  isSprite(): this is Sprite { return false }
  isStage(): this is Stage { return false }

  getVolumeMultiplier(): number { return this.volumeMultiplier }
  setVolumeMultiplier(volumeMultiplier: number): this { this.volumeMultiplier = volumeMultiplier; return this }

  getLayer(): number { return this.layer }
  setLayer(layer: number): this { this.layer = layer; return this }

  getBroadcasts(): BroadcastStore { return this.broadcasts }
  getVariables(): VariableStore { return this.variables }
  getLists(): ListStore { return this.lists }
  getBlocks(): BlockStore { return this.blocks }
  getComments(): CommentStore { return this.comments }
  getCostumes(): TargetCostumeStore { return this.costumes }
  getSounds(): SoundStore { return this.sounds }

  getAssets(): Asset[] { return [...this.getSounds().getSounds(), ...this.getCostumes().getCostumes()]}
}
