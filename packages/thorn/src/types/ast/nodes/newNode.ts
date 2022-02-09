import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { ValueTreeNode } from "../node";
import { MethodCallNode } from "./methodCall";

export class NewNode {
  type = <const>"new";

  constructor(
    protected readonly klass: string,
    protected readonly args: ValueTreeNode[],
  ) { }

  getClass() { return this.klass }
  getArgs() { return this.args }

  static build(reader: LexReader): NewNode {
    reader.expect({ type: TokenType.Keyword, value: "new" });

    const className = reader.expect({ type: TokenType.Identifier }).value;

    const argumentReader = reader.readBetween("(");
    const args: ValueTreeNode[] = [];

    while (!argumentReader.isComplete()) {
      args.push(readValue(argumentReader));

      if (argumentReader.nextIs({ type: TokenType.Separator, value: "," })) {
        argumentReader.read();
      }
    }

    return new NewNode(className, args);
  }
}
