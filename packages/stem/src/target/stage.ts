import { Target } from ".";
import { SerializedBlockStore } from "../block/store";
import { SerializedBroadcastStore } from "../broadcast/store";
import { SerializedCommentStore } from "../comment/store";
import { SerializedCostumeStore } from "../costume/store";
import { SerializedListStore } from "../list/store";
import { SerializedSoundStore } from "../sound/store";
import { SerializedVariableStore } from "../variable/store";
import type { Sprite } from "./sprite";

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

  static fromJson(json: SerializedStage) {
    const stage = new Stage();
    stage.deserialize(json);
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

  deserialize(json: SerializedStage) {
    this.getVariables().deserialize(json.variables);
    this.getLists().deserialize(json.lists);
    this.getBroadcasts().deserialize(json.broadcasts);
    this.getBlocks().deserialize(json.blocks);
    this.getComments().deserialize(json.comments);
    this.getCostumes().deserialize(json.costumes);
    this.getCostumes().setSelectedIndex(json.currentCostume);
    this.getSounds().deserialize(json.sounds);
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
