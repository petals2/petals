import { SILO } from "petals-silo";
import { readValue } from "../../../routines/buildAst/readValue";
import { buildPemdas } from "../../../routines/PEMDAS";
import { LexReader } from "../../reader/lexReader";
import { TokenType, validOperators } from "../../token";
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
    protected readonly name: string,
    protected readonly options: HeapOptions,
  ) { }

  getName() { return this.name }
  getOptions() { return this.options }

  static build(reader: LexReader): HeapDefinitionNode {
    reader.expect({ type: TokenType.Keyword, value: "heap" });

    const name = reader.expect({ type: TokenType.Identifier }).value;

    let options: Partial<HeapOptions> = {};

    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      options = SILO.parse(`{${reader.readBetween("{").toString()}}`) as any;
    }

    if (reader.nextIs({ type: TokenType.Separator, value: ";" })) {
      reader.read();
    }

    return new HeapDefinitionNode(name, {...defaultHeapOptions, ...options});
  }
}
