import { readValue } from "../../../routines/buildAst/readValue";
import { buildPemdas } from "../../../routines/PEMDAS";
import { LexReader } from "../../reader/lexReader";
import { TokenType, validOperators } from "../../token";
import { ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";

export class MathOperationNode {
  type = <const>"mathOperation";

  constructor(
    protected readonly leftHand: ValueTreeNode,
    protected readonly operation: (typeof validOperators)[number],
    protected readonly rightHand: ValueTreeNode,
  ) { }

  getLeftHand() { return this.leftHand }
  getRightHand() { return this.rightHand }
  getOperation() { return this.operation }
  
  static build(reader: LexReader, leftHand: ValueTreeNode): MathOperationNode | ComparisonOperationNode {
    const operation = reader.expect({ type: TokenType.Operator });
    const rightHand = readValue(reader);

    if (rightHand.type === "comparisonOperation") {
      return new ComparisonOperationNode(
        new MathOperationNode(leftHand, operation.value, rightHand.getLeftHand()),
        rightHand.getComparison(),
        rightHand.getRightHand(),
      )
    }

    // TODO: Perform PEMDAS

    return buildPemdas(new MathOperationNode(leftHand, operation.value, rightHand)) as MathOperationNode;
  }
}
