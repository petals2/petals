import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { ValueTreeNode } from "../node";

export class PropertyReferenceNode {
  type = <const>"propertyReference";

  constructor(
    protected readonly property: string,
    protected readonly element: ValueTreeNode,
  ) { }

  getProperty() { return this.property }
  getParent() { return this.element }

  static build(reader: LexReader, element: ValueTreeNode): PropertyReferenceNode {
    reader.expect({ type: TokenType.Separator, value: "." });

    return new PropertyReferenceNode(reader.expect({ type: TokenType.Identifier }).value, element);
  }
}
