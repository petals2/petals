import { TokenRange } from "../lexer/token";
import { ErrorCode } from "./codes";
import { LexError } from "./lexError";
import { ThornError } from "./thornError";

export class ReferenceError extends LexError {
  constructor(protected readonly stateError: string, range: TokenRange) {
    super(ErrorCode.RefrenceError, range, true);
  }

  getSummary() {
    return "Reference Error";
  }

  getMessage() {
    return this.stateError;
  }
}
