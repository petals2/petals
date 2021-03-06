import { Target } from "./target";
import { BlockStore, SerializedBlockStore } from "../block/store";
import { BroadcastStore, SerializedBroadcastStore } from "../broadcast/store";
import { CommentStore, SerializedCommentStore } from "../comment/store";
import { CostumeStore, SerializedCostumeStore } from "../costume/store/store";
import { ListStore, SerializedListStore } from "../list/store";
import { SerializedSoundStore, SoundStore } from "../sound/store";
import { SerializedVariableStore, VariableStore } from "../variable/store";
import type { Sprite } from "./sprite";
import { Project, TargetCostumeStore } from "..";
import { ProjectReference } from "../project/projectReference";

export type SerializedStage = {
  // target generic
  isStage: true,
  name: "Stage",
  variables: SerializedVariableStore,
  lists: SerializedListStore,
  broadcasts: SerializedBroadcastStore,
  blocks: SerializedBlockStore
  comments: SerializedCommentStore,
  currentCostume: number,
  costumes: SerializedCostumeStore,
  sounds: SerializedSoundStore,
  layerOrder: number,
  volume: number,

  // stage specific
  tempo: number,
  videoTransparency: number,
  videoState: "on" | "off" | "on-flipped",
  //TODO: @textToSpeechLanguage
}

export class Stage extends Target {
  private tempo: number = 60;
  private videoTransparency: number = 0.5;
  private videoState: "on" | "off" | "on-flipped" = "off";

  static async fromReference(project: Project, reference: ProjectReference, json: SerializedStage) {
    const stage = new Stage();
    await stage.deserialize(project, reference, json);
    return stage;
  }

  isStage(): this is Stage { return true }
  isSprite(): this is Sprite { return false }

  getTempo(): number { return this.tempo }
  setTempo(tempo: number): this { this.tempo = tempo; return this }

  getVideoTransparency(): number { return this.videoTransparency }
  setVideoTransparency(videoTransparency: number): this { this.videoTransparency = videoTransparency; return this }

  getVideoState(): "on" | "off" | "on-flipped" { return this.videoState }
  setVideoState(videoState: "on" | "off" | "on-flipped"): this { this.videoState = videoState; return this }

  protected async deserialize(project: Project, reference: ProjectReference, json: SerializedStage) {
    this.variables = VariableStore.fromReference(project, reference, json.variables);
    // this.lists = ListStore.fromReference(project, reference, json.lists);
    // this.broadcasts = BroadcastStore.fromReference(project, reference, json.broadcasts);
    this.blocks = BlockStore.fromReference(project, reference, json.blocks);
    this.comments = CommentStore.fromReference(project, reference, json.comments);
    this.costumes = await TargetCostumeStore.fromReference(project, reference, json.costumes);
    this.getCostumes().setSelectedIndex(json.currentCostume);
    this.sounds = await SoundStore.fromReference(project, reference, json.sounds);
    this.setLayer(json.layerOrder);
    this.setVolumeMultiplier(json.volume);
    this.setTempo(json.tempo);
    this.setVideoTransparency(json.videoTransparency);
    this.setVideoState(json.videoState);
  }

  serialize(): SerializedStage {
    return {
      isStage: true,
      name: "Stage",
      variables: this.getVariables().serialize(),
      lists: this.getLists().serialize(),
      broadcasts: this.getBroadcasts().serialize(),
      blocks: this.getBlocks().serialize(),
      comments: this.getComments().serialize(),
      currentCostume: this.getCostumes().getSelectedIndex(),
      costumes: this.getCostumes().serialize(),
      sounds: this.getSounds().serialize(),
      layerOrder: this.getLayer(),
      volume: this.getVolumeMultiplier() * 100,

      tempo: this.getTempo(),
      videoTransparency: this.getVideoTransparency() * 100,
      videoState: this.getVideoState(),
    }
  }
}
