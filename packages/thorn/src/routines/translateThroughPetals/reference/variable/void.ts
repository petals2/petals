import { AnyInput, Block, Input, NumberInput, Target } from "petals-stem";

import { Context } from "../../context";
import { VariableReference } from "./abstract";

export class VoidReference extends VariableReference {
    changeValue(value: Input, target: Target, thread: Block<string>, context: Context): Block<string> {
        throw new Error("Cannot change value of void.");
    }
    
    setValue(value: Input, target: Target, thread: Block<string>, context: Context): Block<string> {
        throw new Error("Cannot set value of void.");
    }

    performSideEffects(target: Target, thread: Block<string>, context: Context): void {}

    getValue(target: Target, thread: Block<string>, context: Context): AnyInput {
        return new NumberInput(5);
    }
}