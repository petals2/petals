export class ValueField {
  constructor(protected readonly val: string | number) {}

  getValue(): string | number { return this.val }

  serialize() { return [this.val, null] }
}
