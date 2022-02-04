import { Context } from "../../../routines/translateThroughPetals/context";
import { getType } from "../../../routines/translateThroughPetals/getType";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";

export abstract class Type {
  isHeapReferenceType(): this is HeapReferenceType { return false }
  isStructureType(): this is StructureType { return false }
  isReferenceType(): this is ReferenceType { return false }
  isLiteralType(): this is LiteralType { return false }
  isBooleanType(): this is BooleanType { return false }
  isNumberType(): this is NumberType { return false }
  isStringType(): this is StringType { return false }
  isUnionType(): this is UnionType { return false }
  isListType(): this is ListType { return false }
  isVoidType(): this is VoidType { return false }

  abstract exactEquals(other: Type): boolean;
  abstract extends(other: Type): boolean;

  static build(reader: LexReader): Type {
    if (reader.nextIs({ type: TokenType.Separator, value: "&" })) {
      return HeapReferenceType.build(reader);
    }

    let base: Type | undefined;

    if (reader.nextIs({ type: TokenType.Identifier, value: "list" })) {
      base = ListType.build(reader);
    } else if (reader.nextIs({ type: TokenType.Identifier, value: "void" })) {
      base = VoidType.build(reader);
    } else if (reader.nextIs({ type: TokenType.Identifier, value: "number" })) {
      base = NumberType.build(reader);
    } else if (reader.nextIs({ type: TokenType.Identifier, value: "string" })) {
      base = StringType.build(reader);
    } else if (reader.nextIs({ type: TokenType.Identifier, value: "boolean" })) {
      base = BooleanType.build(reader);
    } else if (reader.nextIs({ type: TokenType.BooleanLiteral }, { type: TokenType.StringLiteral }, { type: TokenType.NumberLiteral })) {
      base = LiteralType.build(reader);
    } else if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      base = StructureType.build(reader);
    } else if (reader.nextIs({ type: TokenType.Identifier})) {
      base = ReferenceType.build(reader);
    }

    if (base === undefined) throw new Error("Expected type");

    if (reader.nextIs({ type: TokenType.Separator, value: "&" }) && base.isReferenceType()) {
      return HeapReferenceType.build(reader, base.getName())
    }

    if (reader.nextIs({ type: TokenType.Separator, value: "|" })) {
      return UnionType.build(reader).add(base);
    }

    return base;
  }

  static readGeneric(reader: LexReader): Type[] | undefined {
    if (reader.nextIs({ type: TokenType.Comparison, value: "<" })) {
      const subreader = reader.readBetween("<");
      const types: Type[] = [];

      while (!subreader.isComplete()) {
        types.push(Type.build(subreader));

        if (subreader.nextIs({ type: TokenType.Separator, value: "," })) subreader.read();
      }

      return types;
    }

    return undefined;
  }
}

export class VoidType extends Type {
  constructor() { super() }

  exactEquals(other: Type): boolean {
    return other.isVoidType();
  }

  extends(other: Type): boolean {
    return other.isVoidType();
  }

  isVoidType(): this is VoidType { return true }

  static build(reader: LexReader): VoidType {
    reader.expect({ type: TokenType.Identifier, value: "void" });

    return new VoidType();
  }
}

export class BooleanType extends Type {
  constructor() { super() }

  exactEquals(other: Type): boolean {
    return other.isBooleanType();
  }

  extends(other: Type): boolean {
    return other.isBooleanType();
  }

  isBooleanType(): this is BooleanType { return true }

  static build(reader: LexReader): BooleanType {
    reader.expect({ type: TokenType.Identifier, value: "boolean" });

    return new BooleanType();
  }
}

export class NumberType extends Type {
  isNumberType(): this is NumberType { return true }

  exactEquals(other: Type): boolean {
    return other.isNumberType();
  }

  extends(other: Type): boolean {
    return other.isNumberType();
  }

  static build(reader: LexReader): NumberType {
    reader.expect({ type: TokenType.Identifier, value: "number" });

    return new NumberType();
  }
}

export class StringType extends Type {
  isStringType(): this is StringType { return true }

  exactEquals(other: Type): boolean {
    return other.isStringType();
  }

  extends(other: Type): boolean {
    return other.isStringType();
  }

  static build(reader: LexReader): StringType {
    reader.expect({ type: TokenType.Identifier, value: "string" });

    return new StringType();
  }
}

export class ListType extends Type {
  constructor(protected readonly contentType: Type, protected readonly size?: number) {
    super();
  }

  exactEquals(other: Type): boolean {
    return other.isListType() && other.getContentType().exactEquals(this.getContentType()) && this.getSize() === other.getSize();
  }

  extends(other: Type): boolean {
    return other.isListType() && this.getContentType().extends(other.getContentType()) && (this.getSize() === undefined || this.getSize() === other.getSize());
  }

  getContentType(): Type { return this.contentType }

  isListType(): this is ListType { return true }

  isDefinitelySized(): boolean {
    return this.size !== undefined;
  }

  getSize(): number {
    if (!this.isDefinitelySized()) throw new Error("List is not sized");

    return this.size!;
  }

  static build(reader: LexReader): ListType {
    reader.expect({ type: TokenType.Identifier, value: "list" });

    const contentType = Type.readGeneric(reader);

    if (contentType === undefined) throw new Error("List expects 1 generic argument, found 0");
    if (contentType.length !== 1 && contentType.length !== 2) throw new Error("List expects 1 generic argument, found " + contentType.length);
    if (contentType.length === 2 && !contentType[1].isLiteralType()) throw new Error("List expects a literal number size");
    if (contentType.length === 2 && typeof (contentType[1] as LiteralType).getValue() !== "number") throw new Error("List expects a literal number size, found " + typeof (contentType[1] as LiteralType).getValue());

    return new ListType(contentType[0], ((contentType[1] as LiteralType | undefined)?.getValue() as number | undefined));
  }
}

export class LiteralType extends Type {
  constructor(protected readonly value: string | number | boolean) {
    super();
  }

  exactEquals(other: Type): boolean {
    return other.isLiteralType() && other.getValue() === this.getValue();
  }

  extends(other: Type): boolean {
    if (other.isLiteralType()) return other.getValue() === this.getValue();

    if (other.isNumberType()) return typeof this.getValue() === "number";
    if ((other as Type).isBooleanType()) return typeof this.getValue() === "boolean";
    if ((other as Type).isStringType()) return typeof this.getValue() === "string";

    return false;
  }

  isLiteralType(): this is LiteralType { return true }
  getValue(): number | boolean | string { return this.value }

  static build(reader: LexReader): LiteralType {
    const value = reader.expect(
      { type: TokenType.BooleanLiteral },
      { type: TokenType.StringLiteral },
      { type: TokenType.NumberLiteral },
    ).value;

    return new LiteralType(value);
  }
}

export class UnionType extends Type {
  protected types: Type[];

  constructor(...types: Type[]) {
    super();

    this.types = types;
  }

  exactEquals(other: Type): boolean {
    if (!other.isUnionType()) return false

    const otherTypes = other.getTypes();

    if (otherTypes.length !== this.types.length) return false;

    for (const type of this.types) {
      if (this.types.find(t => t.exactEquals(type)) === undefined) return false;
    }

    return true;
  }

  extends(other: Type): boolean {
    if (!other.isUnionType()) {
      return this.types.find(t => !t.extends(other)) === undefined;
    }

    return other.getTypes().every(t => this.types.find(t2 => t2.extends(t)) !== undefined);
  }

  isUnionType(): this is UnionType { return true }

  getTypes(): Type[] { return this.types }

  add(type: Type): this {
    this.types.push(type);
    return this;
  }

  reduce(): this {
    let types: Type[] = [];

    for (const type of this.types) {
      if (type.isUnionType()) {
        types.push(...type.reduce().getTypes());
      } else {
        types.push(type);
      }
    }

    types = types.filter((type, index) => {
      return types.findIndex(t => t.exactEquals(type)) === index;
    });

    this.types = types;

    return this;
  }

  static build(reader: LexReader): UnionType {
    const types: Type[] = [];

    if (reader.nextIs({ type: TokenType.Separator, value: "|" })) {
      reader.expect({ type: TokenType.Separator, value: "|" });

      types.push(Type.build(reader));
    }

    return new UnionType(...types).reduce();
  }

  static reduce(union: UnionType): Type {
    const types = union.getTypes();

    union.reduce();

    if (types.length === 1) return types[0];

    return union;
  }
}

export class StructureType extends Type {
  constructor(
    protected values: Map<string, Type>,
  ) { super() }

  exactEquals(other: Type): boolean {
    if (!other.isStructureType()) return false;

    const otherValues = other.getValues();

    if (otherValues.size !== this.values.size) return false;

    for (const [key, value] of this.values) {
      if (!otherValues.has(key)) return false;

      if (!value.exactEquals(otherValues.get(key)!)) return false;
    }

    return true;
  }

  extends(other: Type): boolean {
    if (!other.isStructureType()) return false;

    const otherValues = other.getValues();

    for (const [key, value] of this.values) {
      if (!otherValues.has(key)) return false;

      if (!value.extends(otherValues.get(key)!)) return false;
    }

    return true;
  }

  isStructureType(): this is StructureType { return true }

  getValues(): Map<string, Type> { return this.values }

  getValue(name: string): Type | undefined { return this.values.get(name) }

  static build(reader: LexReader): StructureType {
    const contents = reader.readBetween("{");

    let v = new Map();

    while (!contents.isComplete()) {
      const name = contents.expect({ type: TokenType.Identifier }).value;

      contents.expect({ type: TokenType.Separator, value: ":" });

      const type = Type.build(contents);

      if (type.isListType() && !type.isDefinitelySized()) {
        throw new Error("Structure type cannot contain a list type with a variable size");
      }

      v.set(name, type);

      if (contents.nextIs({ type: TokenType.Separator, value: "," }, { type: TokenType.Separator, value: ";" })) contents.read();
    }
    
    return new StructureType(v);
  }
}

export class ReferenceType extends Type {
  protected context: Context | undefined;

  constructor(
    protected readonly name: string,
  ) { super() }

  loadIntoContext(context: Context): this {
    this.context = context;
    return this;
  }

  dereference(): Type {
    if (this.context === undefined) throw new Error("Cannot dereference type without context");

    return getType(this.getName(), this.context);
  }

  isReferenceType(): this is ReferenceType { return true }
  getName(): string { return this.name }

  exactEquals(other: Type): boolean {
    if (other.isReferenceType()) return this.dereference().exactEquals(other.dereference());

    return this.dereference().exactEquals(other);
  }

  extends(other: Type): boolean {
    if (other.isReferenceType()) return this.dereference().extends(other.dereference());

    return this.dereference().extends(other);
  }

  static build(reader: LexReader): ReferenceType {
    const name = reader.expect({ type: TokenType.Identifier }).value;

    return new ReferenceType(name);
  }
}

export class HeapReferenceType extends Type {
  constructor(
    protected readonly referencedType: Type,
    protected readonly heapName?: string,
  ) { super() }

  exactEquals(other: Type): boolean {
    if (!other.isHeapReferenceType()) return false;

    return this.referencedType.exactEquals(other.dereference()) && this.getHeapName() === other.getHeapName();
  }

  extends(other: Type): boolean {
    if (other.isHeapReferenceType()) return this.referencedType.extends(other.dereference()) && this.getHeapName() === other.getHeapName();

    return this.referencedType.extends(other);
  }

  isHeapReferenceType(): this is HeapReferenceType { return true }
  dereference(): Type { return this.referencedType }
  getHeapName(): string | undefined { return this.heapName }

  static build(reader: LexReader, name?: string): HeapReferenceType {
    reader.expect({ type: TokenType.Separator, value: "&" });

    return new HeapReferenceType(Type.build(reader), name);
  }
}
