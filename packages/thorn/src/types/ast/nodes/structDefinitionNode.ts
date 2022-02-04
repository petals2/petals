import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { StructureType } from "../type";

export class StructDefinitionNode {
  type = <const>"structDefinitionNode";

  constructor(
    protected readonly name: string,
    protected readonly structure: StructureType,
  ) { }

  getName() { return this.name }
  getStructure() { return this.structure }

  static build(reader: LexReader) {
    reader.expect({ type: TokenType.Keyword, value: "struct" });

    const name = reader.expect({ type: TokenType.Identifier });

    let structure = StructureType.build(reader);

    return new StructDefinitionNode(name.value, structure);
  }
}
