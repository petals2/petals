import { ID } from "../id";

export class Broadcast {
  protected readonly id: string = ID.generate();

  constructor(
    protected name: string,
  ) {}

  getName(): string { return this.name }
  setName(name: string): this { this.name = name; return this }

  getId(): string { return this.id }
}
