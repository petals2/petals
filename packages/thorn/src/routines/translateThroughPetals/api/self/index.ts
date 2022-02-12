import { Block, Target } from "petals-stem";
import { MethodCallNode } from "../../../../types/ast/nodes/methodCall";
import { NumberType, Type, VoidType } from "../../../../types/ast/type";
import { Context } from "../../context";
import { ListReference } from "../../reference/list/abstract";
import { VariableReference } from "../../reference/variable/abstract";
import {
  callChangeX,
  callChangeY,
  callGlideSecsToXY,
  callGotoXY,
  callMove,
  callSetX,
  callSetY,
  callTurnLeft,
  callTurnRight
} from "./functions/motion";

import {
  DirectionReference,
  XPositionReference,
  YPositionReference
} from "./variables/motion";

import {
  SizeReference
} from "./variables/looks";

export namespace SelfApi {
  export function getType(key: string): Type {
    switch (key) {
      case "move": return new VoidType();
      case "turnRight": return new VoidType();
      case "turnLeft": return new VoidType();
      case "goto": return new VoidType();
      case "glideTo": return new VoidType();
      case "changeX": return new VoidType();
      case "setX": return new VoidType();
      case "changeYX": return new VoidType();
      case "setY": return new VoidType();
      case "x": return new NumberType();
      case "y": return new NumberType();
      case "direction": return new NumberType();
      case "size": return new NumberType();
    }

    throw new Error("Cannot access property " + key + " of the sprite.");
  }

  export function getVariableReference(property: string, context: Context): VariableReference {
    switch (property) {
      case "x":
        return new XPositionReference();
      case "y":
        return new YPositionReference();
      case "direction":
        return new DirectionReference();
      case "size":
        return new SizeReference();
    }

    throw new Error("Cannot access property " + property + " of the sprite.");
  }

  export function callSelfApi(property: string, call: MethodCallNode, target: Target, thread: Block, context: Context): VariableReference | ListReference | undefined {
    switch (property) {
      case "move":
        return callMove(call, target, thread, context);
      case "turnRight":
        return callTurnRight(call, target, thread, context);
      case "turnLeft":
        return callTurnLeft(call, target, thread, context);
      case "goto":
        return callGotoXY(call, target, thread, context);
      case "glideTo":
        return callGlideSecsToXY(call, target, thread, context);
      case "changeX":
        return callChangeX(call, target, thread, context);
      case "setX":
        return callSetX(call, target, thread, context);
      case "changeY":
        return callChangeY(call, target, thread, context);
      case "setY":
        return callSetY(call, target, thread, context);
    }

    throw new Error("Cannot call method " + property + " on the sprite.");
  }
}
