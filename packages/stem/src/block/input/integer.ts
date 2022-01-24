export type SerializedIntegerInput = [7, number];

export class IntegerInput {
  constructor(protected val: number) { }

  serialize(): SerializedIntegerInput { return [7, this.val] }

  getValue(): number { return this.val }
}
