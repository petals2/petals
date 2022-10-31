export class ThornError extends Error {
  constructor(public readonly errorCode: number, public readonly fatal = false) {
    super("");
  }

  getFilePositionRange(): [ number, number ] {
    return [ 0, 0 ];
  }

  getSummary() {
    return "";
  }

  getMessage() {
    return "";
  }
}