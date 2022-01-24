export type SerializedPositiveNumberInput = [5, number];

export class PositiveNumberInput {
  constructor(protected val: number) { }

  serialize(): SerializedPositiveNumberInput { return [5, this.val] }

  getValue(): number { return this.val }
}
