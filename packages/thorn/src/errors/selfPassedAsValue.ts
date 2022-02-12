import { SelfReferenceNode } from "../types/ast/nodes/selfReferenceNode";
import { ErrorCode } from "./codes";
import { LexError } from "./lexError";

export class SelfPassedAsValueError extends LexError {
  constructor(public readonly selfReference: SelfReferenceNode) {
    super(ErrorCode.SelfPassedAsValue, [ selfReference ]);
  }

  getSummary() {
    return "'self' cannot be used and passed as value";
  }
}
