import { AnyInput, Block, Input, Target } from "petals-stem";

import { Context } from "../../context";

export abstract class VariableReference {
  abstract changeValue(value: Input, target: Target, thread: Block, context: Context): Block;
  abstract setValue(value: Input, target: Target, thread: Block, context: Context): Block;
  abstract performSideEffects(target: Target, thread: Block, context: Context): void;
  abstract getValue(target: Target, thread: Block, context: Context): AnyInput;
}