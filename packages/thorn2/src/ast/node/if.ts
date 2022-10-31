import { Node, TreeNode, ValueNode } from ".";
import { buildAst, readStatement, readValue } from "..";
import { SafeUnexpectedTokensError, UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class IfNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly condition: ValueNode,
    protected readonly body: TreeNode[],
  ) {
    super(range);
  }

  getCondition() { return this.condition };
  getBody() { return this.body }

  static build(reader: LexReader): IfNode {
    reader.openRange();

    const ifNode = reader.read();

    if (ifNode.type !== TokenType.Keyword || ifNode.value !== "if") {
      reader.pushLexError(new UnexpectedTokenError(`Expected Keyword<"if">`, ifNode, reader.closeRange()))
    }

    let isInParen = false;
    let conditionReader = reader;

    if (reader.nextIs({ type: TokenType.Separator, value: "(" })) {
      conditionReader = reader.readBetween("(");
      isInParen = true;
    }

    const condition = readValue(reader.getFile(), conditionReader);

    if (isInParen && !conditionReader.isComplete()) {
      const unexpected = [];

      while (!conditionReader.isComplete()) {
        unexpected.push(conditionReader.read());
      }

      reader.pushLexError(new SafeUnexpectedTokensError(reader.getFile(), "Unexpected tokens after condition", unexpected));
    }


    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      const ast = buildAst(reader.getFile(), reader.readBetween("{"));

      const range = reader.closeRange();

      return new IfNode(range, condition, ast);
    }

    const statement = readStatement(reader.getFile(), reader);

    const range = reader.closeRange();

    return new IfNode(range, condition, [statement]);
  }
}
