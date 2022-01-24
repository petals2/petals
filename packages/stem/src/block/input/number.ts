export type SerializedNumberInput = [4, number];

export class NumberInput {
  constructor(protected val: number) {}

  serialize(): SerializedNumberInput { return [4, this.val] }

  getValue(): number { return this.val }
}
