export type SerializedStringInput = [10, string];

export class StringInput {
  constructor(protected val: string) { }

  serialize(): SerializedStringInput { return [10, this.val] }

  getValue(): string { return this.val }
}
