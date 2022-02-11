import { ID } from "../id";

export class Variable {
  protected readonly id: string = ID.generate();

  constructor(
    protected name: string,
    protected value: string | number | boolean,
  ) {}

  isCloudVariable(): this is CloudVariable { return false }

  getName(): string { return this.name }
  setName(name: string): this { this.name = name; return this }

  getValue(): string | number | boolean { return this.value }
  setValue(value: string | number | boolean): this { this.value = value; return this }

  getId(): string { return this.id }
}

export class CloudVariable extends Variable {
  isCloudVariable(): this is CloudVariable { return true }
}


