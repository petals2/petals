import { Node, TreeNode, ValueNode } from ".";
import { buildAst, readValue } from "..";
import { UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";
import { IdentifierNode } from "./identifier";
import { ReturnNode } from "./return";
import { Type } from "../type";
import { readType } from "../type/readType";

export class ArrowFunctionNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly async: boolean,
    protected readonly args: { name: IdentifierNode, type?: Type }[],
    protected readonly returnType: Type | undefined,
    protected readonly body: TreeNode[],

  ) {
    super(range)
  }

  getArgs() { return this.args }
  getReturnType() { return this.returnType }
  isAsync() { return this.async }
  getBody() { return this.body }

  static build(reader: LexReader): ArrowFunctionNode {
    reader.openRange();

    let async = reader.nextIs({ type: TokenType.Keyword, value: "async" });

    if (async) reader.expect({ type: TokenType.Keyword, value: "async" });

    if (!reader.nextIs({ type: TokenType.Separator, value: "(" })) {
      reader.pushLexError(new UnexpectedTokenError("Expected arrow function arguments", reader.read(), reader.closeRange()));
    }

    const argsReader = reader.readBetween("(");
    const args = [];

    while (!argsReader.isComplete()) {
      const nameNode = argsReader.expect({ type: TokenType.Identifier });
      const name = new IdentifierNode(TokenRange.fromArray(reader.getFile(), [ nameNode ]), nameNode.value);
      let type: Type | undefined = undefined;

      if (argsReader.nextIs({ type: TokenType.Separator, value: ":" })) {
        argsReader.expect({ type: TokenType.Separator, value: ":" });
        type = readType(argsReader);
      }

      args.push({ name, type });

      if (argsReader.isComplete()) break;

      argsReader.expect({ type: TokenType.Separator, value: "," });
    }

    let type: Type | undefined = undefined;

    if (reader.nextIs({ type: TokenType.Separator, value: ":" })) {
      reader.expect({ type: TokenType.Separator, value: ":" })
      type = readType(reader);
    }

    reader.expect({ type: TokenType.Separator, value: "=>" });

    let body: TreeNode[];

    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      body = buildAst(reader.getFile(), reader.readBetween("{"));
    } else {
      const op = readValue(reader.getFile(), reader);

      body = [ new ReturnNode(op.getTokenRange(), op) ];
    }
  
    return new ArrowFunctionNode(reader.closeRange(), async, args, type, body);
  }
}
