import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { ValueTreeNode } from "../node";

export class PropertyReferenceNode {
  type = <const>"propertyReference";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly property: string,
    protected readonly element: ValueTreeNode,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getProperty() { return this.property }
  getParent() { return this.element }

  static build(reader: LexReader, element: ValueTreeNode): PropertyReferenceNode {
    reader.expect({ type: TokenType.Separator, value: "." });

    const idToken = reader.expect({ type: TokenType.Identifier });

    return new PropertyReferenceNode(new TokenRange(element.getTokenRange().getStart(), idToken), idToken.value, element);
  }
}
