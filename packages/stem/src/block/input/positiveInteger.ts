export type SerializedPositiveIntegerInput = [6, number];

export class PositiveIntegerInput {
  constructor(protected val: number) { }

  serialize(): SerializedPositiveIntegerInput { return [6, this.val] }

  getValue(): number { return this.val }
}
