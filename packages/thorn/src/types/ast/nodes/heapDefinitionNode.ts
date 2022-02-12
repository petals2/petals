import { SILO } from "petals-silo";
import { readValue } from "../../../routines/buildAst/readValue";
import { buildPemdas } from "../../../routines/PEMDAS";
import { LexReader } from "../../reader/lexReader";
import { Token, TokenRange, TokenType, validOperators } from "../../token";
import { ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";

export interface HeapOptions {
  maxSize: number;
}

const defaultHeapOptions: HeapOptions = {
  maxSize: 200_000,
}

export class HeapDefinitionNode {
  type = <const>"heapDefinitionNode";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly name: string,
    protected readonly options: HeapOptions,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getName() { return this.name }
  getOptions() { return this.options }

  static build(reader: LexReader): HeapDefinitionNode {
    const heapToken = reader.expect({ type: TokenType.Keyword, value: "heap" });

    const nameToken = reader.expect({ type: TokenType.Identifier });

    let endtoken: Token = nameToken;

    let options: Partial<HeapOptions> = {};

    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      const innerOptions = reader.readBetween("{");
      options = SILO.parse(`{${innerOptions.toString()}}`) as any;
      endtoken = innerOptions.getRange().getEnd();
    }

    if (reader.nextIs({ type: TokenType.Separator, value: ";" })) {
      reader.read();
    }

    return new HeapDefinitionNode(new TokenRange(heapToken, endtoken), nameToken.value, {...defaultHeapOptions, ...options});
  }
}
