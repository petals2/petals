import { Block } from "petals-stem/dist/src/block";
import { AnyInput } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { Context } from "../../context";

export abstract class BooleanReference {
  abstract performSideEffects(target: Target, thread: Block, context: Context): void;
  abstract getValue(target: Target, thread: Block, context: Context): Block;
}
