import { Blocks, Block, Input, Target, AnyInput } from "petals-stem";
import { Context } from "../../../context";
import { VariableReference } from "../../../reference/variable/abstract";

export class XPositionReference extends VariableReference {
  constructor() {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: number | Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Motion.ChangeXBy> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Motion.ChangeXBy,
      value
    ));
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Motion.SetX> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Motion.SetX,
      value
    ));
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    return target.getBlocks().createBlock(Blocks.Motion.XPosition);
  }
}

export class YPositionReference extends VariableReference {
  constructor() {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: number | Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Motion.ChangeYBy> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Motion.ChangeYBy,
      value
    ));
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Motion.SetY> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Motion.SetY,
      value
    ));
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    return target.getBlocks().createBlock(Blocks.Motion.YPosition);
  }
}

export class DirectionReference extends VariableReference {
  constructor() {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: number | Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Motion.TurnRight> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Motion.TurnRight,
      value
    ));
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Motion.PointInDirection> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Motion.PointInDirection,
      value
    ));
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    return target.getBlocks().createBlock(Blocks.Motion.Direction);
  }
}
