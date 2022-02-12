import { Blocks } from "petals-stem";
import { Block } from "petals-stem/dist/src/block";
import { Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { MethodCallNode } from "../../../../../types/ast/nodes/methodCall";
import { Context } from "../../../context";
import { getVariableReference } from "../../../reference/variable";

export function callMove(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  const arg = call.getArguments()[0];

  if (arg === undefined) throw new Error("Too few arguments to self.move. Requires 1 (the distance to move)");

  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.MoveSteps,
      Input.shadowed(getVariableReference(arg, target, thread, context).getValue(target, thread, context))
    )
  );

  return undefined;
}

export function callTurnRight(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  const arg = call.getArguments()[0];

  if (arg === undefined) throw new Error("Too few arguments to self.turnRight. Requires 1 (the degrees to turn)");

  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.TurnRight,
      Input.shadowed(getVariableReference(arg, target, thread, context).getValue(target, thread, context))
    )
  );

  return undefined;
}

export function callTurnLeft(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  const arg = call.getArguments()[0];

  if (arg === undefined) throw new Error("Too few arguments to self.turnLeft. Requires 1 (the degrees to turn)");

  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.TurnLeft,
      Input.shadowed(getVariableReference(arg, target, thread, context).getValue(target, thread, context))
    )
  );

  return undefined;
}

export function callGotoXY(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  const argX = call.getArguments()[0];

  if (argX === undefined) throw new Error("Too few arguments to self.goto. Requires 2 (x, y)");
  
  const argY = call.getArguments()[1];

  if (argY === undefined) throw new Error("Too few arguments to self.goto. Requires 2 (x, y)");

  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.GotoXy,
      Input.shadowed(getVariableReference(argX, target, thread, context).getValue(target, thread, context)),
      Input.shadowed(getVariableReference(argY, target, thread, context).getValue(target, thread, context))
    )
  );

  return undefined;
}

export function callGlideSecsToXY(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  const argSecs = call.getArguments()[0];

  if (argSecs === undefined) throw new Error("Too few arguments to self.glideTo. Requires 3 (secs, x, y)");

  const argX = call.getArguments()[1];

  if (argX === undefined) throw new Error("Too few arguments to self.glideTo. Requires 3 (secs, x, y)");
  
  const argY = call.getArguments()[2];

  if (argY === undefined) throw new Error("Too few arguments to self.glideTo. Requires 3 (secs, x, y)");

  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.GlideSecsToXy,
      Input.shadowed(getVariableReference(argSecs, target, thread, context).getValue(target, thread, context)),
      Input.shadowed(getVariableReference(argX, target, thread, context).getValue(target, thread, context)),
      Input.shadowed(getVariableReference(argY, target, thread, context).getValue(target, thread, context))
    )
  );

  return undefined;
}

export function callPointInDirection(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  const argDir = call.getArguments()[0];

  if (argDir === undefined) throw new Error("Too few arguments to self.setDirection. Requires 3 (the direction to point towards)");

  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.PointInDirection,
      Input.shadowed(getVariableReference(argDir, target, thread, context).getValue(target, thread, context))
    )
  );

  return undefined;
}

export function callChangeX(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  const arg = call.getArguments()[0];

  if (arg === undefined) throw new Error("Too few arguments to self.changeX. Requires 1 (the distance to move on the x axis)");

  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.ChangeXBy,
      Input.shadowed(getVariableReference(arg, target, thread, context).getValue(target, thread, context))
    )
  );

  return undefined;
}

export function callSetX(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  const arg = call.getArguments()[0];

  if (arg === undefined) throw new Error("Too few arguments to self.setX. Requires 1 (where to move on the x axis)");

  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.SetX,
      Input.shadowed(getVariableReference(arg, target, thread, context).getValue(target, thread, context))
    )
  );

  return undefined;
}

export function callChangeY(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  const arg = call.getArguments()[0];

  if (arg === undefined) throw new Error("Too few arguments to self.changeY. Requires 1 (the distance to move on the y axis)");

  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.ChangeYBy,
      Input.shadowed(getVariableReference(arg, target, thread, context).getValue(target, thread, context))
    )
  );

  return undefined;
}

export function callSetY(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  const arg = call.getArguments()[0];

  if (arg === undefined) throw new Error("Too few arguments to self.setY. Requires 1 (where to move on the y axis)");

  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.SetY,
      Input.shadowed(getVariableReference(arg, target, thread, context).getValue(target, thread, context))
    )
  );

  return undefined;
}

export function callBounceIfOnEdge(call: MethodCallNode, target: Target, thread: Block, context: Context) {
  thread.getTail().append(
    target.getBlocks().createBlock(
      Blocks.Motion.IfOnEdgeBounce
    )
  );

  return undefined;
}
