import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";

export abstract class VariableReference {
  abstract changeValue(value: Input, target: Target, thread: Block, context: Context): Block;
  abstract setValue(value: Input, target: Target, thread: Block, context: Context): Block;
  abstract performSideEffects(target: Target, thread: Block, context: Context): void;
  abstract getValue(target: Target, thread: Block, context: Context): AnyInput;
}
