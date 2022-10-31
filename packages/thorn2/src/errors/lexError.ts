import { TreeNode } from "../ast/node";
import { TokenRange } from "../lexer/token";
import { ThornError } from "./thornError";

export class LexError extends ThornError {
  constructor(public readonly errorCode: number, public readonly tokenRange: TokenRange, public readonly fatal = false) {
    super(errorCode, tokenRange.getFile(), fatal);
  }

  getFilePositionRange(): [number, number] {
    return [ this.tokenRange.getStart().startPos, this.tokenRange.getEnd().endPos ];
  }
}
