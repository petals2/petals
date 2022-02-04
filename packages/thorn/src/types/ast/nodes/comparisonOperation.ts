import { readValue } from "../../../routines/buildAst/readValue";
import { TokenType, validComparators } from "../../token";
import { LexReader } from "../../reader/lexReader";
import { ValueTreeNode } from "../node";

export class ComparisonOperationNode<Left extends ValueTreeNode = ValueTreeNode, Right extends ValueTreeNode = ValueTreeNode, Comparison extends (typeof validComparators)[number] = (typeof validComparators)[number]> {
  type = <const>"comparisonOperation";

  constructor(
    protected readonly leftHand: Left,
    protected readonly comparison: Comparison,
    protected readonly rightHand: Right,
  ) { }

  getLeftHand() { return this.leftHand }
  getRightHand() { return this.rightHand }
  getComparison() { return this.comparison }

  static build<Left extends ValueTreeNode>(reader: LexReader, leftHand: Left): ComparisonOperationNode<Left> {
    const operation = reader.expect({ type: TokenType.Comparison });
    const rightHand = readValue(reader);

    // TODO: Perform PEMDAS

    return new ComparisonOperationNode(leftHand, operation.value, rightHand);
  }
}
