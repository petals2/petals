import { SelfReferenceNode } from "../types/ast/nodes/selfReferenceNode";
import { LexError } from "./lexError";

export class SelfPassedAsValueError extends LexError {
  constructor(public readonly selfReference: SelfReferenceNode) {
    super(2, [ selfReference ]);
  }

  getSummary() {
    return "'self' cannot be used and passed as value";
  }
}
