import { Block, SerializedBlock } from "../..";
import { Argument } from "../argument";
import { ID } from "../../../id";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

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

  constructor(private procCode: string, args: ( InstanceType<typeof Argument.ReporterBoolean> | InstanceType<typeof Argument.ReporterStringNumber> )[], defaultValues: (string | boolean)[]) {
    super("procedures_prototype");

    this.setArguments(args, defaultValues);
  }

  setProcCode(procCode: string): this {
    this.procCode = procCode;
    return this;
  }

  getProcCode(): string {
    return this.procCode;
  }

  setArguments(args: (InstanceType<typeof Argument.ReporterBoolean> | InstanceType<typeof Argument.ReporterStringNumber>)[], defaultValues: (string | boolean)[]): this {
    this.argIds = new Array(args.length).fill(0).map(e => ID.generate());
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
