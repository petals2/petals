import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { ValueTreeNode } from "../node";
import { SelfReferenceNode } from "./selfReferenceNode";

export class ArrayLiteralNode {
  type = <const>"arrayLiteral";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly values: ValueTreeNode[],
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getValues() { return this.values }

  static build(reader: LexReader): ArrayLiteralNode {
    const argumentReader = reader.readBetween("[");

    let vals: ValueTreeNode[] = [];

    while (!argumentReader.isComplete()) {
      const val = readValue(argumentReader);

      if (val instanceof SelfReferenceNode) {
        reader.pushLexError(new SelfPassedAsValueError(val));
      }

      vals.push(val);

      if (argumentReader.nextIs({ type: TokenType.Separator, value: "," })) argumentReader.read();
    }

    return new ArrayLiteralNode(argumentReader.getRange(), vals);
  }
}
