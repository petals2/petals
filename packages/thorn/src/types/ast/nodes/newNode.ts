import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { ValueTreeNode } from "../node";
import { MethodCallNode } from "./methodCall";
import { SelfReferenceNode } from "./selfReferenceNode";

export class NewNode {
  type = <const>"new";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly klass: string,
    protected readonly args: ValueTreeNode[],
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getClass() { return this.klass }
  getArgs() { return this.args }

  static build(reader: LexReader): NewNode {
    const newToken = reader.expect({ type: TokenType.Keyword, value: "new" });

    const className = reader.expect({ type: TokenType.Identifier }).value;

    const argumentReader = reader.readBetween("(");
    const args: ValueTreeNode[] = [];

    while (!argumentReader.isComplete()) {
      const arg = readValue(argumentReader);
      
      if (arg instanceof SelfReferenceNode) {
        reader.pushLexError(new SelfPassedAsValueError(arg));
      }

      args.push(arg);

      if (argumentReader.nextIs({ type: TokenType.Separator, value: "," })) {
        argumentReader.read();
      }
    }

    return new NewNode(new TokenRange(newToken, argumentReader.getRange().getEnd()), className, args);
  }
}
