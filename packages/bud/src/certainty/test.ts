import util from "util";
import { ComputedAdd } from "./add";
import { ComputedValue } from "./computedValue";
import { ComputedVariable } from "./computedVariable";
import { ComputedDiv } from "./div";
import { ComputedMul } from "./mul";
import { ComputedSub } from "./sub";

// const a = new ComputedAdd(
//     new ComputedSub(
//         new ComputedMul(
//             new ComputedValue(1),
//             new ComputedMul(
//                 new ComputedVariable("x"),
//                 new ComputedVariable("x")
//             )
//         ),
//         new ComputedMul(
//             new ComputedValue(4),
//             new ComputedVariable("x")
//         )
//     ),
//     new ComputedValue(4)
// );
// const b = new ComputedMul(
//     new ComputedSub(
//         new ComputedVariable("x"),
//         new ComputedValue(2)
//     ),
//     new ComputedSub(
//         new ComputedVariable("x"),
//         new ComputedValue(2)
//     )
// );

// console.log(util.inspect(a.collectLikeTerms(), false, Infinity, true));
// console.log(util.inspect(b.collectLikeTerms(), false, Infinity, true));
// console.log(a.equalTo(b));

// const a = new ComputedDiv(new ComputedVariable("x"), new ComputedDiv(new ComputedVariable("x"), new ComputedValue(3)));

// const b = new ComputedDiv(new ComputedMul(new ComputedValue(3), new ComputedVariable("x")), new ComputedVariable("x"));

// console.log(util.inspect(a.collectLikeTerms(), false, Infinity, true));
// console.log(util.inspect(b.collectLikeTerms(), false, Infinity, true));
// console.log(a.equalTo(b));

const a = new ComputedDiv(new ComputedVariable("x"), new ComputedDiv(new ComputedVariable("x"), new ComputedValue(3)));

const b = new ComputedDiv(new ComputedMul(new ComputedValue(3), new ComputedVariable("x")), new ComputedVariable("x"));

console.log(util.inspect(a.collectLikeTerms(), false, Infinity, true));
console.log(util.inspect(b.collectLikeTerms(), false, Infinity, true));
console.log(a.equalTo(b));
