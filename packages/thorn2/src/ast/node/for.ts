import { Node, TreeNode, ValueNode } from ".";
import { buildAst, readStatement, readValue } from "..";
import { SafeUnexpectedTokensError, UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class ForNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly initialization: TreeNode,
    protected readonly condition: ValueNode,
    protected readonly finalExpression: ValueNode,
    protected readonly body: TreeNode[],
  ) {
    super(range);
  }

  getInitialization() { return this.initialization }
  getCondition() { return this.condition };
  getFinalExpression() { return this.finalExpression }
  getBody() { return this.body }

  static build(reader: LexReader): ForNode {
    reader.openRange();

    reader.expect({ type: TokenType.Keyword, value: "for" })

    const subreader = reader.readBetween("(");

    const initialization = readStatement(reader.getFile(), subreader);
    const condition = readValue(reader.getFile(), subreader);
    subreader.expect({ type: TokenType.Separator, value: ";" })
    const finalExpression = readValue(reader.getFile(), subreader);

    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      const ast = buildAst(reader.getFile(), reader.readBetween("{"));

      const range = reader.closeRange();

      return new ForNode(range, initialization, condition, finalExpression, ast);
    }

    const statement = readStatement(reader.getFile(), reader);

    const range = reader.closeRange();

    return new ForNode(range, initialization, condition, finalExpression, [statement]);
  }
}
