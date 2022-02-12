import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { buildPemdas } from "../../../routines/PEMDAS";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType, validOperators } from "../../token";
import { ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";
import { SelfReferenceNode } from "./selfReferenceNode";

export class MathOperationNode {
  type = <const>"mathOperation";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly leftHand: ValueTreeNode,
    protected readonly operation: (typeof validOperators)[number],
    protected readonly rightHand: ValueTreeNode,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getLeftHand() { return this.leftHand }
  getRightHand() { return this.rightHand }
  getOperation() { return this.operation }
  
  static build(reader: LexReader, leftHand: ValueTreeNode): MathOperationNode | ComparisonOperationNode {
    const operation = reader.expect({ type: TokenType.Operator });
    const rightHand = readValue(reader);
    
    if (leftHand instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(leftHand));
    }
    
    if (rightHand instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(rightHand));
    }

    if (rightHand.type === "comparisonOperation") {
      return new ComparisonOperationNode(
        new TokenRange(leftHand.getTokenRange().getStart(), rightHand.getTokenRange().getEnd()),
        new MathOperationNode(
          new TokenRange(leftHand.getTokenRange().getStart(), rightHand.getLeftHand().getTokenRange().getEnd()),
          leftHand,
          operation.value,
          rightHand.getLeftHand()
        ),
        rightHand.getComparison(),
        rightHand.getRightHand(),
      )
    }

    // TODO: Perform PEMDAS

    return buildPemdas(new MathOperationNode(new TokenRange(leftHand.getTokenRange().getStart(), rightHand.getTokenRange().getEnd()), leftHand, operation.value, rightHand)) as MathOperationNode;
  }
}