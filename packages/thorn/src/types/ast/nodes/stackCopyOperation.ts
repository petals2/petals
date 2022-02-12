import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { ValueTreeNode } from "../node";
import { SelfReferenceNode } from "./selfReferenceNode";

export class HeapCopyOperation {
  type = <const>"heapCopy";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly value: ValueTreeNode,
    protected readonly name: string = "global",
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getValue() { return this.value }
  getName() { return this.name }

  static build(reader: LexReader): HeapCopyOperation {
    const nameToken = reader.nextIs({ type: TokenType.Identifier })
      ? reader.expect({ type: TokenType.Identifier })
      : undefined;

    const separatorToken = reader.expect({ type: TokenType.Separator, value: "&" });

    const val = readValue(reader);
    
    if (val instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(val));
    }

    return new HeapCopyOperation(new TokenRange(nameToken || separatorToken, val.getTokenRange().getEnd()), val, nameToken ? nameToken.value : separatorToken.value);
  }
}
