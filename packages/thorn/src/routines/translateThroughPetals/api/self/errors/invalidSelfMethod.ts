import { ErrorCode } from "../../../../../errors/codes";
import { TransformError } from "../../../../../errors/transformError";
import { MethodCallNode } from "../../../../../types/ast/nodes/methodCall";
import { Context } from "../../../context";

export class InvalidSelfMethodError extends TransformError {
  constructor(protected readonly property: string, protected readonly call: MethodCallNode, context: Context) {
    super(ErrorCode.InvalidSelfMethod, context, [ call ], false);
  }

  getMessage() {
    return `Method ${this.property} does not exist on the sprite.`;
  }

  getSummary() {
    return `Invalid sprite method call`;
  }
}