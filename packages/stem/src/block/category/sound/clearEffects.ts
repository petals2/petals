import { BlockKind } from "../../kinds";

export class ClearEffects extends BlockKind.Stack<"sound_cleareffects"> {
  constructor() {
    super("sound_cleareffects");
  }
}
