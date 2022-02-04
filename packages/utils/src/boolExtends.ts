export type BoolExtends<base, A extends base, B extends base> = base extends A ? boolean : base extends B ? boolean : A extends B ? true : false;

type C = BoolExtends<string, "B", "C" | "A">
