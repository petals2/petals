import chalk from "chalk";

import { Context } from "../routines/translateThroughPetals/context";
import { TreeNode } from "../types/ast/node";
import { ErrorCode } from "./codes";
import { TransformError } from "./transformError";

export class InvalidValueError extends TransformError {
  constructor(public readonly context: Context, public readonly invalidValue: TreeNode) {
    super(ErrorCode.InvalidValue, context, [ invalidValue ], true);
  }

  getSummary() {
    return "Invalid value reference";
  }

  getMessage(): string {
    return "type '" + chalk.cyan(this.invalidValue.type) + "' which cannot be used or passed as a value";
  }
}