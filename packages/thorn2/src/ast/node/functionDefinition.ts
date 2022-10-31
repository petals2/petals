import { Node, TreeNode } from ".";
import { buildAst } from "..";
import { UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";
import { IdentifierNode } from "./identifier";
import { Type } from "../type";
import { readType } from "../type/readType";

export class FunctionDefinitionNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly exported: boolean,
    protected readonly warp: boolean,
    protected readonly name: string,
    protected readonly args: { name: IdentifierNode, type?: Type }[],
    protected readonly returnType: Type | undefined,
    protected readonly body: TreeNode[],
  ) {
    super(range);
  }

  isExported() { return this.exported }
  isWarp() { return this.warp }
  getName() { return this.name }
  getArgs() { return this.args }
  getReturnType() { return this.returnType }
  getBody() { return this.body }

  static build(reader: LexReader): FunctionDefinitionNode {
    reader.openRange();

    const exported = reader.nextIs({ type: TokenType.Keyword, value: "export" });

    if (exported) reader.expect({ type: TokenType.Keyword, value: "export" })

    reader.expect({ type: TokenType.Keyword, value: "function" });

    let warp = false;

    if (reader.nextIs({ type: TokenType.Keyword, value: "yields" })) {
      warp = true;
      reader.expect({ type: TokenType.Keyword, value: "yields" });
    }

    const name = reader.expect({ type: TokenType.Identifier }).value;

    if (!reader.nextIs({ type: TokenType.Separator, value: "(" })) {
      reader.pushLexError(new UnexpectedTokenError("Expected function arguments", reader.read(), reader.closeRange()));
    }

    const argsReader = reader.readBetween("(");
    const args: { name: IdentifierNode, type?: Type }[] = [];

    while (!argsReader.isComplete()) {
      const nameToken = argsReader.expect({ type: TokenType.Identifier });
      const name = new IdentifierNode(TokenRange.fromArray(reader.getFile(), [ nameToken ]), nameToken.value);
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

    if (!reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      reader.pushLexError(new UnexpectedTokenError("Expected function body", reader.read(), reader.closeRange()));
    }

    const bodyReader = reader.readBetween("{");
    const body = buildAst(reader.getFile(), bodyReader);

    return new FunctionDefinitionNode(reader.closeRange(), exported, warp, name, args, type, body);
  }
}
