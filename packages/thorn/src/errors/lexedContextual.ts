import { Token } from "../types/token";

export class LexedContextualError extends Error {
  constructor(error: string, public readonly lexedElements: Token[], public readonly lexedIndexRange: [number, number]) {
    super(error);
  }
}
