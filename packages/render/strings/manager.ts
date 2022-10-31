import { Block } from "petals-stem";
import { Call } from "petals-stem/dist/src/block/category/procedures/call";
import { Prototype } from "petals-stem/dist/src/block/category/procedures/prototype";
import { Opcodes } from "petals-stem/src/block";
import { English } from "./english";

const langGroup = {
  English,
}

export class StringsManager {
  constructor(protected readonly lang: "English") {}

  getForRaw(block: Block): string {
    return langGroup[this.lang][block.getOpcode().toUpperCase() as Uppercase<Opcodes>];
  }

  getArgs(block: Block): Record<"inputs" | "fields" | "stacks", string[]> {
    if (block.getOpcode() === "procedures_call" || block.getOpcode() === "procedures_prototype") {
      let p: Prototype;

      if (block.getOpcode() === "procedures_call") {
        p = (block as Call).getPrototype();
      } else {
        p = block as Prototype;
      }

      return {
        inputs: p.getArgumentIds().map(e => `i${e}`),
        fields: [],
        stacks: [],
      };
    }

    const res = langGroup[this.lang][block.getOpcode().toUpperCase() as Uppercase<Opcodes>];
    const results: Record<"inputs" | "fields" | "stacks", string[]> = { inputs: [], fields: [], stacks: [] };

    for (let i = 0; i < res.length; i++) {
      if (res[i] === "%") {
        i++;
        const selector = res[i];
        let text = "";
        while (res[i] !== ";") {
          if (i > res.length) throw new Error("Invalid string format for opcode: " + block.getOpcode() + ", language: " + this.lang);
          text += res[i];
          i++;
        }
        results[selector === "i" ? "inputs" : selector === "s" ? "stacks" : "fields"].push(text);
      }
    }

    return results;
  }

  getForFormatted(block: Block, args: Record<string, string>): string {
    if (block.getOpcode() === "procedures_call" || block.getOpcode() === "procedures_prototype") {
      let p: Prototype;

      if (block.getOpcode() === "procedures_call") {
        p = (block as Call).getPrototype();
      } else {
        p = block as Prototype;
      }

      const argIds = p.getArgumentIds();
      const name = p.getProcCode();
      let result = "";

      for (let i = 0; i < name.length; i++) {
        if (name[i] === "%") {
          i++;

          console.log(args, argIds, "i" + argIds[0]);
          result += args["i" + argIds.shift()];
        } else {
          result += name[i];
        }
      }

      return result;
    }

    const res = langGroup[this.lang][block.getOpcode().toUpperCase() as Uppercase<Opcodes>];

    let formatted = "";

    for (let i = 0; i < res.length; i++) {
      if (res[i] === "%") {
        let kind = "";

        i++;

        while (res[i] !== ";") {
          if (i > res.length) throw new Error("Invalid string format for opcode: " + block.getOpcode() + ", language: " + this.lang);
          kind += res[i++];
        }

        formatted += args[kind];
        continue;
      }

      formatted += res[i];
    }

    return formatted;
  }
}
