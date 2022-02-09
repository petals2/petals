import { BlockKind } from "petals-stem/dist/src/block/kinds";
import { Block } from "petals-stem/dist/src/block";
import { Input } from "petals-stem/dist/src/block/input";

export abstract class Renderer<T> {
  abstract renderStack(b: InstanceType<(typeof BlockKind)["Stack"] | (typeof BlockKind)["Hat"]>, dark: boolean): T;
  abstract renderBlock(b: Block, dark: boolean): T;
  abstract renderInput(i: Input, dark: boolean): T;
}
