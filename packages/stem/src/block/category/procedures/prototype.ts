import { Block, SerializedBlock } from "../../block";
import { Argument } from "../argument";
import { ID } from "../../../id";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";
import { SerializedBlockStore } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export type SerialzedPrototype = SerializedBlock & {
  mutation: {
    argumentdefaults: string,
    argumentids: string,
    argumentnames: string,
    children: [],
    proccode: string,
    tagName: "mutation",
    warp: boolean,
  }
}

export class Prototype extends BlockKind.Stack<"procedures_prototype"> {
  protected argIds!: string[];
  protected defaultValues!: (string | boolean)[];
  protected warp: boolean = false;

  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "procedures_prototype")
      throw new Error(`Expected opcode "procedures_prototype", got "${json.opcode}"`);

    const betterJson = json as SerialzedPrototype;
    const argIds = JSON.parse(betterJson.mutation.argumentids);
    const argNames = JSON.parse(betterJson.mutation.argumentnames);
    const argDefaults = JSON.parse(betterJson.mutation.argumentdefaults);

    const procCodeSplit = betterJson.mutation.proccode.split("%");
    procCodeSplit.shift();

    const argTypes = procCodeSplit.map(e => e[0]);

    const args: (InstanceType<typeof Argument.ReporterBoolean> | InstanceType<typeof Argument.ReporterStringNumber>)[] = [];

    for (let i = 0; i < argNames.length; i++) {
      const name = argNames[i];
      const type = argTypes[i];
      const id = argIds[i];

      switch (type) {
        case "s": args.push(context.getCurrentBlockStore()!.createBlock(Argument.ReporterStringNumber, name, id)); break;
        case "b": args.push(context.getCurrentBlockStore()!.createBlock(Argument.ReporterBoolean, name, id)); break;
        default:
          throw new Error("Unknown argument type \"" + type + "\"")
      }
    }

    return new Prototype(betterJson.mutation.proccode, args, argDefaults, ID, argIds);
  }

  constructor(private procCode: string, args: ( InstanceType<typeof Argument.ReporterBoolean> | InstanceType<typeof Argument.ReporterStringNumber> )[], defaultValues: (string | boolean)[], ID?: string, argIds?: string[]) {
    super("procedures_prototype", ID);

    this.setArguments(args, defaultValues, argIds);
  }

  setProcCode(procCode: string): this {
    this.procCode = procCode;
    return this;
  }

  getProcCode(): string {
    return this.procCode;
  }

  setArguments(args: (InstanceType<typeof Argument.ReporterBoolean> | InstanceType<typeof Argument.ReporterStringNumber>)[], defaultValues: (string | boolean)[], argIds?: string[]): this {
    this.argIds = argIds ?? new Array(args.length).fill(0).map(e => ID.generate());

    this.defaultValues = defaultValues;

    this.clearInputs();

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const id = this.argIds[i];

      this.setInput(id, Input.shadowed(arg));
    }

    return this;
  }

  getArgument(id: string): InstanceType<typeof Argument.ReporterBoolean> | InstanceType<typeof Argument.ReporterStringNumber> {
    const input = this.getInput(id);

    if (!input) {
      throw new Error("Definition " + id + " input is missing");
    }

    const topLayer = input.getTopLayer();

    if (!(topLayer instanceof Block)) {
      throw new Error("Definition " + id + " input is not a block");
    }

    return topLayer as InstanceType<typeof Argument.ReporterBoolean> | InstanceType<typeof Argument.ReporterStringNumber>;
  }

  getArguments(): (InstanceType<typeof Argument.ReporterBoolean> | InstanceType<typeof Argument.ReporterStringNumber>)[] {
    return this.argIds.map(id => this.getArgument(id));
  }

  getArgumentIds(): string[] { return this.argIds }

  setWarp(warp: boolean): this {
    this.warp = warp;
    return this;
  }

  getWarp(): boolean {
    return this.warp;
  }

  serialize(): SerialzedPrototype {
    return {
      ...super.serialize(),
      mutation: {
        argumentdefaults: JSON.stringify(this.defaultValues.map(v => v.toString())),
        argumentids: JSON.stringify(this.argIds),
        argumentnames: JSON.stringify(this.getArguments().map(a => a.getName())),
        children: [],
        proccode: this.getProcCode(),
        tagName: "mutation",
        warp: this.getWarp(),
      }
    }
  }
}
