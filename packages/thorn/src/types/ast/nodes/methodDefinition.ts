import { buildAst } from "../../../routines/buildAst";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { GetTreeNode, TreeNode, ValueTreeNode } from "../node";
import { Type } from "../type";

export class MethodDefinitionNode {
  type = <const>"methodDefinition";

  constructor(
    protected readonly name: string,
    protected readonly returnType: Type,
    protected readonly args: { name: string, type: Type }[],
    protected readonly contents: TreeNode[],
  ) { }

  getName() { return this.name }
  getReturnType() { return this.returnType }
  getArguments() { return this.args }
  getContents() { return this.contents }

  static build(reader: LexReader): MethodDefinitionNode {
    if (reader.nextIs({ type: TokenType.Keyword, value: "function" }))
      reader.expect({ type: TokenType.Keyword, value: "function" });

    const name = reader.expect({ type: TokenType.Identifier }).value;
    const argReader = reader.readBetween("(");

    reader.expect({ type: TokenType.Separator, value: ":" });

    const returnType = Type.build(reader);

    const contents = buildAst(reader.readBetween("{"));

    const args: { name: string, type: Type }[] = [];

    while (!argReader.isComplete()) {
      const name = argReader.expect({ type: TokenType.Identifier }).value;

      argReader.expect({ type: TokenType.Separator, value: ":" });

      const type = Type.build(argReader);

      args.push({ name, type });

      if (argReader.nextIs({ type: TokenType.Separator, value: "," })) argReader.read();
    }

    return new MethodDefinitionNode(name, returnType, args, contents);
  }
}
