import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { ListInput } from "petals-stem/dist/src/block/input/list";
import { Stack } from "petals-stem/dist/src/block/kinds/stack";
import { Hat } from "petals-stem/dist/src/block/kinds/hat";
import { Input } from "petals-stem/dist/src/block/input";
import { Block } from "petals-stem/dist/src/block";
import { Renderer } from "./renderer";
import { Chalk, ChalkInstance } from "chalk";
import { BroadcastInput } from "petals-stem/dist/src/block/input/broadcast";
import { ColorInput } from "petals-stem/dist/src/block/input/color";

export class TextRenderer extends Renderer<string> {
    private chalk: ChalkInstance;

    constructor(protected readonly colorLevel: 0 | 1 | 2 | 3 = 3) {
        super();

        this.chalk = new Chalk({ level: colorLevel })
    }

    renderStack(b: Stack | Hat): string {
        let str = this.renderBlock(b);

        while (b.hasNext()) {
            str = this.renderBlock(b = b.next());
        }

        return str;
    }

    renderBlock(b: Block): string {
        
    }

    renderInput(i: Input): string {
        const top = i.getTopLayer();

        if (top instanceof Block) return this.renderBlock(top);

        if (top instanceof VariableInput)
            return this.chalk.bgHex("#FF8C1A").white(` ${top.getValue().getName()} `)

        if (top instanceof ListInput)
            return this.chalk.bgHex("#FF661A").white(` ${top.getValue().getName()} `)
        
        if (top instanceof BroadcastInput)
            throw new Error("TODO");

        if (top instanceof ColorInput)
            return this.chalk.bgWhite.black(` #${top.getValue()[0].toString(16).padStart(2, "0")}${top.getValue()[1].toString(16).padStart(2, "0")}${top.getValue()[2].toString(16).padStart(2, "0")} `)
        
        return this.chalk.bgWhite.black(` ${top.getValue()} `)
    }
}