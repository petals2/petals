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
import { DeserializationContext } from "../project/deserializationContext";

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
  private broadcasts = new BroadcastStore();

  static async fromReference(context: DeserializationContext, json: SerializedStage) {
    const stage = new Stage();
    await stage.deserialize(context, json);
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

  getBroadcasts(): BroadcastStore { return this.broadcasts }

  protected async deserialize(context: DeserializationContext, json: SerializedStage) {
    context.setCurrentTarget(this);

    context.getProject().getTargets().setStage(this);

    this.variables = VariableStore.fromReference(context, json.variables);
    // this.lists = ListStore.fromReference(context, json.lists);
    this.broadcasts = BroadcastStore.fromReference(context, json.broadcasts);
    this.blocks = BlockStore.fromReference(context, json.blocks);
    this.comments = CommentStore.fromReference(context, json.comments);
    this.costumes = await TargetCostumeStore.fromReference(context, json.costumes);
    this.getCostumes().setSelectedIndex(json.currentCostume);
    this.sounds = await SoundStore.fromReference(context, json.sounds);
    this.setLayer(json.layerOrder);
    this.setVolumeMultiplier(json.volume);
    this.setTempo(json.tempo);
    this.setVideoTransparency(json.videoTransparency);
    this.setVideoState(json.videoState);

    context.setCurrentTarget(undefined);
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
      layerOrder: 0,
      volume: this.getVolumeMultiplier() * 100,

      tempo: this.getTempo(),
      videoTransparency: this.getVideoTransparency() * 100,
      videoState: this.getVideoState(),
    }
  }
}
