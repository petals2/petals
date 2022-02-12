import { buildAst } from "../../../routines/buildAst";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { GetTreeNode, TreeNode, ValueTreeNode } from "../node";
import { Type } from "../type";

export class MethodDefinitionNode {
  type = <const>"methodDefinition";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly name: string,
    protected readonly returnType: Type,
    protected readonly args: { name: string, type: Type }[],
    protected readonly contents: TreeNode[],
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getName() { return this.name }
  getReturnType() { return this.returnType }
  getArguments() { return this.args }
  getContents() { return this.contents }

  static build(reader: LexReader): MethodDefinitionNode {
    const functionToken = reader.nextIs({ type: TokenType.Keyword, value: "function" })
      ? reader.expect({ type: TokenType.Keyword, value: "function" })
      : undefined;

    const nameToken = reader.expect({ type: TokenType.Identifier });
    const argReader = reader.readBetween("(");

    reader.expect({ type: TokenType.Separator, value: ":" });

    const returnType = Type.build(reader);

    const contentTokens = reader.readBetween("{");
    const contents = buildAst(contentTokens);

    const args: { name: string, type: Type }[] = [];

    while (!argReader.isComplete()) {
      const name = argReader.expect({ type: TokenType.Identifier }).value;

      argReader.expect({ type: TokenType.Separator, value: ":" });

      const type = Type.build(argReader);

      args.push({ name, type });

      if (argReader.nextIs({ type: TokenType.Separator, value: "," })) argReader.read();
    }

    return new MethodDefinitionNode(new TokenRange(functionToken ? functionToken : nameToken, contentTokens.getRange().getEnd()), nameToken.value, returnType, args, contents);
  }
}
