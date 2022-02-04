import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { ValueTreeNode } from "../node";

export class HeapCopyOperation {
  type = <const>"heapCopy";

  constructor(
    protected readonly value: ValueTreeNode,
    protected readonly name: string = "global",
  ) { }

  getValue() { return this.value }
  getName() { return this.name }

  static build(reader: LexReader): HeapCopyOperation {
    let name: string | undefined;

    if (reader.nextIs({ type: TokenType.Identifier })) {
      name = reader.expect({ type: TokenType.Identifier }).value;
    }

    reader.expect({ type: TokenType.Separator, value: "&" })

    return new HeapCopyOperation(readValue(reader), name);
  }
}
