import { Block, Target } from "petals-stem";

import { Context } from "../../context";

export abstract class BooleanReference {
  abstract performSideEffects(target: Target, thread: Block, context: Context): void;
  abstract getValue(target: Target, thread: Block, context: Context): Block;
}