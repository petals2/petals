export class ThornError extends Error {
  constructor(public readonly errorCode: number, public readonly file: string, public readonly fatal = false) {
    super("");
  }

  getFile(): string {
    return this.file
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
