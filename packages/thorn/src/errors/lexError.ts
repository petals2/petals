import { TreeNode } from "../types/ast/node";
import { TokenRange } from "../types/token";
import { ThornError } from "./thornError";

export class LexError extends ThornError {
  constructor(public readonly errorCode: number, public readonly nodes: TreeNode[], public readonly fatal = false) {
    super(errorCode, fatal);
  }

  getFilePositionRange(): [number, number] {
    const tokenRange = TokenRange.fromNodes(this.nodes);
    return [ tokenRange.getStart().startPos, tokenRange.getEnd().endPos ];
  }
}