import { SerializedBlockStore } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { SerializedBlock } from "../../block";
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

export class Call extends BlockKind.Stack<"procedures_call"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "procedures_call")
      throw new Error(`Expected opcode "procedures_call", got "${json.opcode}"`);

    const betterJson = json as SerializedCall;

    const prototype = context.getCurrentBlockStore()!.getPrototypeByName(betterJson.mutation.proccode);

    if (prototype === undefined)
      throw new Error("Could not find custom block by proccode \"" + betterJson.mutation.proccode + "\"");

    let args: Input[] = [];
    const ids = JSON.parse(betterJson.mutation.argumentids);

    for (const id of ids) {
      if (betterJson.inputs[id] == undefined)
        throw new Error("Expected input " + id + " on Call (" + betterJson.mutation.proccode + ")");

      args.push(Input.fromReference(context, serializedStore, betterJson.inputs[id]));
    }

    return new Call(prototype, ID, ...args);
  }

  constructor(private readonly prototypeBlock: Prototype, ID?: string, ...args: Input[]) {
    super("procedures_call", ID);

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
