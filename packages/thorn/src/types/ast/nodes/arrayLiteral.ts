import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { ValueTreeNode } from "../node";

export class ArrayLiteralNode {
  type = <const>"arrayLiteral";

  constructor(
    protected readonly values: ValueTreeNode[],
  ) { }

  getValues() { return this.values }

  static build(reader: LexReader): ArrayLiteralNode {
    const argumentReader = reader.readBetween("[");

    let vals: ValueTreeNode[] = [];

    while (!argumentReader.isComplete()) {
      vals.push(readValue(argumentReader));

      if (argumentReader.nextIs({ type: TokenType.Separator, value: "," })) argumentReader.read();
    }

    return new ArrayLiteralNode(vals);
  }
}
