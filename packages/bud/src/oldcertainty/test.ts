import { ComputedAdd } from "./add";
import { ComputedValue } from "./computedValue";
import { ComputedVariable } from "./computedVariable";
import { ComputedMul } from "./mul";

const varA = new ComputedVariable("abcd");
const varB = new ComputedVariable("abcdef");

const a = new ComputedAdd(varA, varA);
const b = new ComputedMul(new ComputedValue(2), varA);

console.log(a.equalTo(b));
