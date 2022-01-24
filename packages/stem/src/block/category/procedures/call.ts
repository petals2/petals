import { SerializedBlock } from "../..";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";
import { Prototype } from "./prototype";

export type SerializedCall = SerializedBlock & {
  mutation: {
    argumentids: string,
    children: [],
    tagName: "mutation",
    proccode: string,
    warp: "true" | "false",
  }
}

export class Call extends BlockKind.Stack {
  constructor(private readonly prototypeBlock: Prototype, ...args: Input[]) {
    super("procedures_call");

    this.setArguments(args);
  }

  getPrototype(): Prototype {
    return this.prototypeBlock;
  }

  setArguments(args: Input[]): this {
    this.clearInputs();

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const id = this.prototypeBlock.getArgumentIds()[i];

      arg.link(this);

      this.setInput(id, arg);
    }

    return this;
  }

  serialize(): SerializedCall {
    return {
      ...super.serialize(),
      mutation: {
        argumentids: JSON.stringify(this.prototypeBlock.getArgumentIds()),
        children: [],
        tagName: "mutation",
        proccode: this.prototypeBlock.getProcCode(),
        warp: this.prototypeBlock.getWarp() ? "true" : "false",
      }
    }
  }
}
