import { TokenRange } from "../lexer/token";
import { ErrorCode } from "./codes";
import { LexError } from "./lexError";
import { ThornError } from "./thornError";

export class InvalidLexStateError extends LexError {
  constructor(protected readonly stateError: string, range: TokenRange) {
    super(ErrorCode.InvalidLexState, range, true);
  }

  getSummary() {
    return "The lexer entered an invalid state.";
  }

  getMessage() {
    return this.stateError;
  }
}
