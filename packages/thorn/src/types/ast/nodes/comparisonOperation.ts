import { readValue } from "../../../routines/buildAst/readValue";
import { TokenRange, TokenType, validComparators } from "../../token";
import { LexReader } from "../../reader/lexReader";
import { ValueTreeNode } from "../node";
import { SelfReferenceNode } from "./selfReferenceNode";
import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";

export class ComparisonOperationNode<Left extends ValueTreeNode = ValueTreeNode, Right extends ValueTreeNode = ValueTreeNode, Comparison extends (typeof validComparators)[number] = (typeof validComparators)[number]> {
  type = <const>"comparisonOperation";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly leftHand: Left,
    protected readonly comparison: Comparison,
    protected readonly rightHand: Right,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getLeftHand() { return this.leftHand }
  getRightHand() { return this.rightHand }
  getComparison() { return this.comparison }

  static build<Left extends ValueTreeNode>(reader: LexReader, leftHand: Left): ComparisonOperationNode<Left> {
    const operation = reader.expect({ type: TokenType.Comparison });
    const rightHand = readValue(reader);

    if (leftHand instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(leftHand));
    }

    if (rightHand instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(rightHand));
    }

    // TODO: Perform PEMDAS

    return new ComparisonOperationNode(new TokenRange(leftHand.getTokenRange().getStart(), rightHand.getTokenRange().getEnd()), leftHand, operation.value, rightHand);
  }
}
