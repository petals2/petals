import { Node, ValueNode } from ".";
import { readValue } from "..";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType, validComparators } from "../../lexer/token";

export class ComparisonNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly leftHand: ValueNode,
    protected readonly condition: (typeof validComparators)[number],
    protected readonly rightHand: ValueNode,
  ) {
    super(range);
  }

  getLeftHand() { return this.leftHand }
  getRightHand() { return this.rightHand }

  getCondition() { return this.condition }

  static build(base: ValueNode, reader: LexReader): ComparisonNode {
    reader.openRange();
    
    const condition = reader.expect({ type: TokenType.Comparison }).value;
    const rightHand = readValue(reader.getFile(), reader);

    const baseRange = reader.closeRange();
    const range = new TokenRange(reader.getFile(), base.getTokenRange(), baseRange);

    return new ComparisonNode(range, base, condition, rightHand);
  }
}
