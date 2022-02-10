import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { ListInput } from "petals-stem/dist/src/block/input/list";
import { Stack } from "petals-stem/dist/src/block/kinds/stack";
import { Hat } from "petals-stem/dist/src/block/kinds/hat";
import { Input } from "petals-stem/dist/src/block/input";
import { Block } from "petals-stem/dist/src/block";
import { Renderer } from "./renderer";
import chalk from "chalk";
import { BroadcastInput } from "petals-stem/dist/src/block/input/broadcast";
import { ColorInput } from "petals-stem/dist/src/block/input/color";
import { StringsManager } from "../strings/manager";
import { Field } from "petals-stem";
import { VariableField } from "petals-stem/dist/src/block/field/variable";
import { ListField } from "petals-stem/dist/src/block/field/list";
import { BroadcastField } from "petals-stem/dist/src/block/field/broadcast";
import { StringInput } from "petals-stem/src/block/input/string";

export class TextRenderer extends Renderer<string> {
  private chalk: InstanceType<typeof chalk.Instance>;
  private stringsManager: StringsManager;

  constructor(language: "English" = "English", colorLevel: 0 | 1 | 2 | 3 = 3) {
    super();

    this.stringsManager = new StringsManager(language);
    this.chalk = new chalk.Instance({ level: colorLevel });
  }

  renderStack(b: Stack | Hat | undefined, dark: boolean): string {
    let str = "";

    while (b) {
      if (b.getOpcode() === "__phantom__") {
        b = b.getNext();
        continue;
      };
      str += this.renderBlock(b, !dark, false) + "\n";
      b = b.getNext();
    }

    return str;
  }

  renderBlock(b: Block, dark: boolean, includeParns: boolean = true): string {
    if (b.getOpcode() === "argument_reporter_string_number" || b.getOpcode() === "argument_reporter_boolean") {
      return includeParns ? chalk.bgHex("#FF6680").bold.white(`( ${(b as any).getField("VALUE").getValue()} )`) : chalk.bgHex("#FF6680").bold.white(` ${(b as any).getField("VALUE").getValue()} `);
    }

    const args = this.stringsManager.getArgs(b);

    let m: Record<string, string> = {};

    for (const field of args.fields) {
      const contents = (b as any).getField(field.substring(1)) as Field | undefined;

      if (!contents) {
        m[field] = "Unset field (" + field + ")";
        continue;
      }

      m[field] = `${this.renderInput(contents, !dark)}`;
    }

    for (const field of args.inputs) {
      const contents = (b as any).getInput(field.substring(1)) as Input | undefined;

      if (!contents) {
        m[field] = "Unset input (" + field + ")";
        continue;
      }

      m[field] = `${this.renderInput(contents, !dark)}`;
    }

    for (const stack of args.stacks) {
      const headInput = (b as any).getInput(stack.substring(1)) as Input | undefined;

      if (!headInput) {
        m[stack] = "Unset stack (" + stack + ")";
        continue;
      }

      const rendered = this.renderStack((headInput.getTopLayer() as Block), dark);

      m[stack] = " \n" + rendered.split("\n").slice(0, -1).map(line => this.wrapColorForCategory(b.getOpcode().split("_")[0], b.getOpcode(), "", !dark, false) + line).join("\n") + "\n" + this.wrapColorForCategory(b.getOpcode().split("_")[0], b.getOpcode(), " ", !dark, false);
    }

    return this.wrapColorForCategory(b.getOpcode().split("_")[0], b.getOpcode(), this.stringsManager.getForFormatted(b, m), !dark, includeParns);
  }

  renderInput(i: Input | Field, dark: boolean, includeParns: boolean = true): string {
    const top = i instanceof Input ? i.getTopLayer() : i;

    if (top instanceof Block) return this.renderBlock(top, dark, includeParns);

    if (top instanceof VariableInput || top instanceof VariableField)
      return this.chalk.bgHex("#FF8C1A").white(includeParns ? `( ${top.getValue().getName()} )` : ` ${top.getValue().getName()} `)

    if (top instanceof ListInput || top instanceof ListField)
      return this.chalk.bgHex("#FF661A").white(includeParns ? `( ${top.getValue().getName()} )` : ` ${top.getValue().getName()} `)
    
    if (top instanceof BroadcastInput || top instanceof BroadcastField)
      throw new Error("TODO");

    if (top instanceof ColorInput)
      return this.chalk.bgWhite.black(` #${top.getValue()[0].toString(16).padStart(2, "0")}${top.getValue()[1].toString(16).padStart(2, "0")}${top.getValue()[2].toString(16).padStart(2, "0")} `)

    if (top instanceof StringInput)
      return this.chalk.bgWhite.black(includeParns ? `( "${top.getValue()}" )` : ` "${top.getValue()}" `)

    return this.chalk.bgWhite.black(includeParns ? `( ${top.getValue()} )` : ` ${top.getValue()} `)
  }

  wrapColorForCategory(category: string, opcode: string, str: string, dark: boolean, includeParns: boolean = true): string {
    str = includeParns ? `( ${str} )` : ` ${str} `;

    switch (category) {
      case "argument":
      case "procedures": return chalk.bgHex(dark ? "#FA002A" : "#FF6680").bold.white(str);
      case "operator": return chalk.bgHex(dark ? "#368F36" : "#59C059").bold.white(str);
      case "control": return chalk.bgHex(dark ? "#C47C00" : "#FFAB19").bold.white(str);
      case "event": return chalk.bgHex(dark ? "#B38600" : "#FFBF00").bold.white(str);
      case "data":
        if ((["data_setvariableto", "data_changevariableby", "data_showvariable", "data_hidevariable"]).includes(opcode)) {
          return chalk.bgHex(dark ? "#C56200" : "#FF8C1A").bold.white(str);
        } else {
          return chalk.bgHex(dark ? "#C54100" : "#FF661A").bold.white(str);
        }
      default: throw new Error("Unknown category " + category);
    }
  }
}
