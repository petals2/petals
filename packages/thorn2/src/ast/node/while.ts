import { Node, TreeNode, ValueNode } from ".";
import { buildAst, readStatement, readValue } from "..";
import { SafeUnexpectedTokensError, UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class WhileNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly condition: ValueNode,
    protected readonly body: TreeNode[],
  ) {
    super(range);
  }

  getCondition() { return this.condition };
  getBody() { return this.body }

  static build(reader: LexReader): WhileNode {
    reader.openRange();

    const whileNode = reader.read();

    if (whileNode.type !== TokenType.Keyword || whileNode.value !== "while") {
      reader.pushLexError(new UnexpectedTokenError(`Expected Keyword<"while">`, whileNode, reader.closeRange()))
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

      reader.pushLexError(new SafeUnexpectedTokensError("Unexpected tokens after condition", reader.getFile(), unexpected));
    }


    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      const ast = buildAst(reader.getFile(), reader.readBetween("{"));

      const range = reader.closeRange();

      return new WhileNode(range, condition, ast);
    }

    const statement = readStatement(reader.getFile(), reader);

    const range = reader.closeRange();

    return new WhileNode(range, condition, [statement]);
  }
}
