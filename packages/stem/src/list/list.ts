import { ID } from "../id";

export class List {
  protected readonly id: string = ID.generate();

  constructor(
    protected name: string,
    protected values: string[],
  ) {}

  getName(): string { return this.name }
  setName(name: string): this { this.name = name; return this }

  getValues(): string[] { return this.values }
  setValues(values: string[]): this { this.values = values; return this }

  getId(): string { return this.id }
}
