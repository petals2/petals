export type SerializedAngleInput = [8, number];

export class AngleInput {
  constructor(protected val: number) { }

  serialize(): SerializedAngleInput { return [8, this.val] }

  getValue(): number { return this.val }
}
