import { SerializedVariableStore, VariableStore } from "../variable/store";
import { ListStore, SerializedListStore } from "../list/store";
import { Vector2 } from "../types/vector2";
import type { Stage } from "./stage";
import { Target } from "./target";
import { BroadcastStore, SerializedBroadcastStore } from "../broadcast/store";
import { BlockStore, SerializedBlockStore } from "../block/store";
import { CommentStore, SerializedCommentStore } from "../comment/store";
import { CostumeStore, SerializedCostumeStore } from "../costume/store/store";
import { SerializedSoundStore, SoundStore } from "../sound/store";
import { Project, TargetCostumeStore } from "..";
import { ProjectReference } from "../project/projectReference";
import { DeserializationContext } from "../project/deserializationContext";

export type SerializedSprite = {
  // target generic
  isStage: false,
  name: string,
  variables: SerializedVariableStore,
  lists: SerializedListStore,
  broadcasts: { },
  blocks: SerializedBlockStore
  comments: SerializedCommentStore,
  currentCostume: number,
  costumes: SerializedCostumeStore,
  sounds: SerializedSoundStore,
  layerOrder: number,
  volume: number,

  // sprite specific
  visible: boolean,
  x: number,
  y: number,
  size: number,
  direction: number,
  draggable: boolean,
  rotationStyle: "all around" | "left-right" | "don't rotate",
}

export class Sprite extends Target {
  protected position: Vector2 = Vector2.zero();
  protected size: number = 1;
  protected direction: number = 90;
  protected visible: boolean = true;
  protected draggable: boolean = false;
  protected rotationStyle: "all around" | "left-right" | "don't rotate" = "all around";

  static async fromReference(context: DeserializationContext, json: SerializedSprite) {
    const sprite = new Sprite(json.name);
    await sprite.deserialize(context, json);
    return sprite;
  }

  constructor(
    private name: string,
  ) { super() }

  getName(): string { return this.name }
  setName(name: string): this { this.name = name; return this }

  isStage(): this is Stage { return false }
  isSprite(): this is Sprite { return true }

  getPosition(): Vector2 { return this.position }
  setPosition(vec2: Vector2): this { this.position = vec2; return this }

  getSize(): number { return this.size }
  setSize(size: number): this { this.size = size; return this }

  getDirection(): number { return this.direction }
  setDirection(direction: number): this { this.direction = direction; return this }

  getVisible(): boolean { return this.visible }
  setVisible(visible: boolean): this { this.visible = visible; return this }

  getDraggable(): boolean { return this.draggable }
  setDraggable(draggable: boolean): this { this.draggable = draggable; return this }

  getRotationStyle(): "all around" | "left-right" | "don't rotate" { return this.rotationStyle }
  setRotationStyle(rotationStyle: "all around" | "left-right" | "don't rotate"): this { this.rotationStyle = rotationStyle; return this }

  protected async deserialize(context: DeserializationContext, json: SerializedSprite) {
    context.setCurrentTarget(this);

    this.setName(json.name);
    this.variables = VariableStore.fromReference(context, json.variables);
    this.lists = ListStore.fromReference(context, json.lists);
    this.costumes = await TargetCostumeStore.fromReference(context, json.costumes);
    this.getCostumes().setSelectedIndex(json.currentCostume);
    this.sounds = await SoundStore.fromReference(context, json.sounds);
    this.blocks = BlockStore.fromReference(context, json.blocks);
    this.comments = CommentStore.fromReference(context, json.comments);
    this.setLayer(json.layerOrder);
    this.setVolumeMultiplier(json.volume);
    this.setPosition(new Vector2(json.x, json.y));
    this.setSize(json.size);
    this.setDirection(json.direction);
    this.setVisible(json.visible);
    this.setDraggable(json.draggable);
    this.setRotationStyle(json.rotationStyle);

    context.setCurrentTarget(undefined)
  }

  serialize(): SerializedSprite {
    return {
      isStage: false,
      name: this.getName(),
      variables: this.getVariables().serialize(),
      lists: this.getLists().serialize(),
      broadcasts: { },
      blocks: this.getBlocks().serialize(),
      comments: this.getComments().serialize(),
      currentCostume: this.getCostumes().getSelectedIndex(),
      costumes: this.getCostumes().serialize(),
      sounds: this.getSounds().serialize(),
      layerOrder: this.getLayer(),
      volume: this.getVolumeMultiplier() * 100,

      visible: this.getVisible(),
      x: this.getPosition().getX(),
      y: this.getPosition().getY(),
      size: this.getSize(),
      direction: this.getDirection(),
      draggable: this.getDraggable(),
      rotationStyle: this.getRotationStyle(),
    }
  }
}
