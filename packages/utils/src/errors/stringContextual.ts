export class StringContextualError extends Error {
  constructor(error: string, public readonly string: string, public readonly characterRange: [number, number]) {
    super(error);
  }
}
