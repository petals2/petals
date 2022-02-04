export abstract class Reader {
  abstract read(): unknown;
  abstract isComplete(): boolean;
  abstract expect(...items: unknown[]): unknown;
  abstract readUntil(...items: unknown[]): unknown;
}
