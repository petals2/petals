import { Block, SerializedBlock } from ".";
import type { Project, ProjectReference } from "..";
import {
  Argument,
  Control,
  Events,
  Looks,
  Motion,
  Procedures,
  Sensing,
  Sound,
  Variables
} from "./category";

const blockOpcodes = <const> {
  argument_reporter_boolean: Argument.ReporterBoolean,
  argument_reporter_string_number: Argument.ReporterStringNumber,
  control_repeat: Control.Repeat,
  control_repeat_until: Control.RepeatUntil,
  control_while: Control.While,
  control_for_each: Control.ForEach,
  control_forever: Control.Forever,
  control_wait: Control.Wait,
  control_wait_until: Control.WaitUntil,
  control_if: Control.If,
  control_if_else: Control.IfElse,
  control_stop: Control.Stop,
  control_create_clone_of: Control.CreateCloneOf,
  control_delete_this_clone: Control.DeleteThisClone,
  data_setvariableto: Variables.SetVariableTo,
  data_changevariableby: Variables.ChangeVariableBy,
  data_hidevariable: Variables.HideVariable,
  data_showvariable: Variables.ShowVariable,
  data_addtolist: Variables.AddToList,
  data_deleteoflist: Variables.DeleteOfList,
  data_deletealloflist: Variables.DeleteAllOfList,
  data_insertatlist: Variables.InsertAtList,
  data_replaceitemoflist: Variables.ReplaceItemOfList,
  data_hidelist: Variables.HideList,
  data_showlist: Variables.ShowList,
  event_broadcast: Events.Broadcast,
  event_broadcastandwait: Events.BroadcastAndWait,
  event_whenbackdropswitchesto: Events.WhenBackdropSwitchesTo,
  event_whenbroadcastreceived: Events.WhenBroadcastReceived,
  event_whenflagclicked: Events.WhenFlagClicked,
  event_whengreaterthan: Events.WhenGreaterThan,
  event_whenkeypressed: Events.WhenKeyPressed,
  event_whenstageclicked: Events.WhenStageClicked,
  event_whenthisspriteclicked: Events.WhenThisSpriteClicked,
  looks_say: Looks.Say,
  looks_sayforsecs: Looks.SayForSecs,
  looks_think: Looks.Think,
  looks_thinkforsecs: Looks.ThinkForSecs,
  looks_show: Looks.Show,
  looks_hide: Looks.Hide,
  looks_switchcostumeto: Looks.SwitchCostumeTo,
  looks_switchbackdropto: Looks.SwitchBackdropTo,
  looks_switchbackdroptoandwait: Looks.SwitchBackdropToAndWait,
  looks_nextcostume: Looks.NextCostume,
  looks_nextbackdrop: Looks.NextBackdrop,
  looks_changeeffectby: Looks.ChangeEffectBy,
  looks_seteffectto: Looks.SetEffectTo,
  looks_cleargraphiceffects: Looks.ClearGraphicEffects,
  looks_changesizeby: Looks.ChangeSizeBy,
  looks_setsizeto: Looks.SetSizeTo,
  looks_gotofrontback: Looks.GotoFrontBack,
  looks_goforwardbackwardlayers: Looks.GoForwardBackwardLayers,
  motion_movesteps: Motion.MoveSteps,
  motion_gotoxy: Motion.GotoXy,
  motion_goto: Motion.Goto,
  motion_turnright: Motion.TurnRight,
  motion_turnleft: Motion.TurnLeft,
  motion_pointindirection: Motion.PointInDirection,
  motion_pointtowards: Motion.PointTowards,
  motion_glidesecstoxy: Motion.GlideSecsToXy,
  motion_glideto: Motion.GlideTo,
  motion_ifonedgebounce: Motion.IfOnEdgeBounce,
  motion_setrotationstyle: Motion.SetRotationStyle,
  motion_changexby: Motion.ChangeXBy,
  motion_setx: Motion.SetX,
  motion_changeyby: Motion.ChangeYBy,
  motion_sety: Motion.SetY,
  procedures_call: Procedures.Call,
  procedures_prototype: Procedures.Prototype,
  procedures_definition: Procedures.Definition,
  sensing_resettimer: Sensing.ResetTimer,
  sensing_setdragmode: Sensing.SetDragMode,
  sensing_askandwait: Sensing.AskAndWait,
  sound_play: Sound.Play,
  sound_playuntildone: Sound.PlayUntilDone,
  sound_stopallsounds: Sound.StopAllSounds,
  sound_changeeffectby: Sound.ChangeEffectBy,
  sound_cleareffects: Sound.ClearEffects,
  sound_setvolumeto: Sound.SetVolumeTo,
  sound_changevolumeby: Sound.ChangeVolumeBy
}

export type BlockMap = typeof blockOpcodes;

export function registerCustomBlock<T extends string>(opcode: T, constructor: { fromReference(project: Project, reference: ProjectReference, json: SerializedBlock): Block<T> }): void {
  (blockOpcodes as any)[opcode] = constructor;
}

export function getBlockConstructorByOpcode<T extends string>(opcode: T): BlockMap extends Record<T, infer U> ? U : (Block<T> | undefined) {
  return (blockOpcodes as any)[opcode];
}

Block.getBlockByOpcode = getBlockConstructorByOpcode;
