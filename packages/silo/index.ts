import { StringReader } from "petals-utils";

const WhitespaceCharacters = <const> [" ", "\n", "\t", "\r"]

class Reference {
  constructor(public readonly id: number) {}
}

class Definition {
  constructor(public readonly id: number, public readonly value: SiloType) { }
}

export type SiloType = number | boolean | string | null | { [key: string]: SiloType, [key: number]: SiloType } | SiloType[] | Reference | Definition;
export type ReturnSiloType = number | boolean | string | null | { [key: string]: ReturnSiloType, [key: number]: ReturnSiloType } | ReturnSiloType[];

export enum SiloLexType {
  String,
  Number,
  Boolean,
  Separator,
  Identifier,
}

export type SiloLex = {
  type: SiloLexType.String,
  value: string,
} | {
  type: SiloLexType.Identifier,
  value: string,
} | {
  type: SiloLexType.Number,
  value: number,
} | {
  type: SiloLexType.Separator,
  value: "[" | "]" | "{" | "}" | "," | "<" | ">" | ":" | "&" | "*",
} | {
  type: SiloLexType.Boolean,
  value: boolean,
};

function lex(reader: StringReader): SiloLex[] {
  const tokens: SiloLex[] = [];

  while(!reader.isComplete()) {
    if (reader.nextIsOne(...WhitespaceCharacters)) {
      reader.read();
      continue;
    }

    if (reader.nextIs("//")) {
      reader.readUntil("\n", "\r");
    }

    if (reader.peek().is("/") && reader.peek(1).is("*")) {
      while (!(reader.peek().is("*") && reader.peek(1).is("/"))) {
        reader.read();
      }

      reader.read();
      reader.read();
    }

    const separator = reader.nextIsOne("[", "]", "{", "}", ",", "<", ">", ":", "&", "*");

    if (separator) {
      tokens.push({
        type: SiloLexType.Separator,
        value: reader.expect(separator).value,
      });

      continue;
    }

    const number = reader.nextIsOne("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".");

    if (number) {
      const fullNumber = reader.readUntilNot("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".");

      tokens.push({
        type: SiloLexType.Number,
        value: parseFloat(fullNumber.value),
      });

      continue;
    }

    const boolean = reader.nextIsOne("true", "false");

    if (boolean) {
      for (let i = 0; i < boolean.length; i++) {
        reader.read();
      }

      tokens.push({
        type: SiloLexType.Boolean,
        value: boolean === "true",
      });

      continue;
    }

    const isStr = reader.nextIsOne('"', "'");

    if (isStr) {
      reader.expect(isStr);

      tokens.push({
        type: SiloLexType.String,
        value: reader.readUntil(isStr).value
      });

      reader.expect(isStr);

      continue;
    }

    const contents = reader.readUntil("[", "]", "{", "}", ",", "<", ">", ":", "&", "*", ...WhitespaceCharacters).value;

    if (!contents) continue;

    tokens.push({
      type: SiloLexType.Identifier,
      value: contents,
    });
  }

  return tokens;
}

function readEnclosingCurly(lex: SiloLex[]): SiloLex[] {
  let depth = 0;

  for (let i = 0; i < lex.length; i++) {
    const element = lex[i];

    if (element.type === SiloLexType.Separator && element.value === "{") {
      depth++;
    }

    if (element.type === SiloLexType.Separator && element.value === "}") {
      depth--;
    }

    if (depth === 0) {
      return lex.slice(0, i + 1);
    }
  }

  throw new Error("Missing closing }");
}

function readEnclosingRect(lex: SiloLex[]): SiloLex[] {
  let depth = 0;

  for (let i = 0; i < lex.length; i++) {
    const element = lex[i];

    if (element.type === SiloLexType.Separator && element.value === "[") {
      depth++;
    }

    if (element.type === SiloLexType.Separator && element.value === "]") {
      depth--;
    }

    if (depth === 0) {
      return lex.slice(0, i + 1);
    }
  }

  throw new Error("Missing closing ]");
}

function readType(lex: SiloLex[]): [SiloType, number] {
  if (lex[0].type === SiloLexType.Number) {
    return [lex[0].value, 1];
  }

  if (lex[0].type === SiloLexType.Identifier) {
    if (lex[0].value === "null") {
      return [null, 1];
    }

    return [lex[0].value, 1];
  }

  if (lex[0].type === SiloLexType.String) {
    return [lex[0].value, 1];
  }

  if (lex[0].type === SiloLexType.Boolean) {
    return [lex[0].value, 1];
  }

  if (lex[0].value === "<") {
    if (lex[1].type !== SiloLexType.Separator) throw new Error(`Found opening to definition or reference (<) but following it was a ${SiloLexType[lex[1].type]}{${lex[1].value}} rather than the expected Identifiers Def or Ref`);
    if (lex[1].value !== "&" && lex[1].value !== "*") throw new Error(`Found opening to definition or reference (<) but following it was a ${SiloLexType[lex[1].type]}{${lex[1].value}} rather than the expected Identifiers Def or Ref`);
    if (lex[2].type !== SiloLexType.Number) throw new Error(`found ${lex[1].value} definition, but following it was a ${SiloLexType[lex[2].type]}{${lex[2].value}} rather than expected type Number`);
    if (lex[3].type !== SiloLexType.Separator || lex[3].value !== ">") throw new Error(`Missing closing (>) for ${lex[1].value} ${lex[2].value}`);

    if (lex[1].value === "*") {
      return [new Reference(lex[2].value), 4];
    }

    const type = readType(lex.slice(4));

    return [new Definition(lex[2].value, type[0]), 4 + type[1]];
  }

  if (lex[0].value === "{") {
    const containing = readEnclosingCurly(lex);
    let object: Record<string | number, SiloType> = {}

    for (let i = 1; i < containing.length;) {
      const key = containing[i++];

      if (key.type === SiloLexType.Separator || key.type === SiloLexType.Boolean) {
        if (key.value === "}") {
          return [object, i];
        }

        throw new Error(`Found Separator{${key.value}}. Expected any non-Separator and non-Boolean (other than })`);
      }

      const colon = containing[i++];

      if (colon.type !== SiloLexType.Separator || colon.value !== ":") {
        throw new Error(`Expected Separator{:}`);
      }

      const [value, read] = readType(containing.slice(i));

      i += read;

      const maybeComma = containing[i];

      if (maybeComma && maybeComma.type === SiloLexType.Separator && maybeComma.value === ",") {
        i++;
      }

      object[key.value] = value;
    }
  }

  if (lex[0].value === "[") {
    const containing = readEnclosingRect(lex);
    let arr: Array<SiloType> = []
    let i;

    for (i = 1; i < containing.length;) {
      if (containing[i].type === SiloLexType.Separator && containing[i].value === "]") {
        return [arr, i + 1];
      }

      const [value, read] = readType(containing.slice(i));

      i += read;

      const maybeComma = containing[i];

      if (maybeComma && maybeComma.type === SiloLexType.Separator && maybeComma.value === ",") {
        i++;
      }

      arr.push(value);
    }

    return [arr, i];
  }

  throw new Error("Pog");
}

function buildCircularMap(t: SiloType, defMap: Map<number, SiloType>): SiloType {
  if (t instanceof Definition) {
    defMap.set(t.id, t.value);
    return buildCircularMap(t.value, defMap);
  }

  if (t instanceof Reference) {
    return t;
  }

  if (typeof t !== "object") {
    return t;
  }

  if (Array.isArray(t)) {
    return t.map(el => buildCircularMap(el, defMap));
  }

  const o2: any = {}

  for (const key in t) {
    if (Object.prototype.hasOwnProperty.call(t, key)) {
      const el = t[key];

      o2[key] = buildCircularMap(el, defMap);
    }
  }

  return o2;
}

// This function is going to return an array of paths
// that point to the cycles in the object
const getCycles = (object: any): string[][] => {
  // Save traversed references here
  const traversedProps = new Set();
  const cycles: string[][] = [];

  // Recursive function to go over objects/arrays
  const traverse = function (currentObj: any, path: string[]) {
    // If we saw a node it's a cycle, no need to travers it's entries
    if (traversedProps.has(currentObj)) {
      cycles.push(path);
      return;
    }

    traversedProps.add(currentObj);

    // Traversing the entries
    for (let key in currentObj) {
      const value = currentObj[key];
      // We don't want to care about the falsy values
      // Only objects and arrays can produce the cycles and they are truthy
      if (currentObj.hasOwnProperty(key) && value) {
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i += 1) {
            traverse(value[i], [...path, key.toString(), i.toString()]);
          }
        } else if (typeof value === "object" && value !== null) {
          // We'd like to save path as parent[0] in case when parent obj is an array
          // and parent.prop in case it's an object
          let parentIsArray = currentObj.constructor === Array;
          traverse(value, [...path, key.toString()]);
        }

        // We don't care of any other values except Arrays and objects.
      }
    }
  }

  traverse(object, []);
  return cycles;
};

function resolveMapRecursive(t: SiloType, defMap: Map<number, ReturnSiloType>): ReturnSiloType {
  while (t instanceof Definition) {
    t = t.value;
  }

  if (t instanceof Reference) {
    const v = defMap.get(t.id);

    if (v === undefined) {
      throw new Error(`Cannot find definition for reference ${t.id}`);
    }

    return v;
  }

  if (typeof t !== "object" || t === null) {
    return t;
  }

  if (Array.isArray(t)) {
    for (let i = 0; i < t.length; i++) {
      if (getCycles(t[i]).length === 0) {
        t[i] = resolveMapRecursive(t[i], defMap as any);
      }
    }

    return t as any;
  }

  for (const key in t) {
    if (Object.prototype.hasOwnProperty.call(t, key)) {
      if (getCycles(t[key]).length === 0) {
        t[key] = resolveMapRecursive(t[key], defMap);
      }
    }
  }

  return t as any;
}

function resolveCircularMap(defMap: Map<number, SiloType>): void {
  const keys = [...defMap.keys()];

  for (let key of keys) {
    const val = defMap.get(key)!;

    while (val instanceof Definition) {
      //todo;
    }

    if (val instanceof Reference) {
      throw new Error("You cannot map a define directly to a reference");
    }

    if (typeof val !== "object" || val === null || val instanceof Reference || val instanceof Definition) {
      continue;
    }

    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        val[i] = resolveMapRecursive(val[i], defMap as any);
      }
    }

    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        val[key] = resolveMapRecursive(val[key], defMap as any);
      }
    }
  }
}

export namespace SILO {
  export function parse(t: string): ReturnSiloType {
    const map = new Map();
    const parsed = readType(lex(new StringReader(t)))[0];

    buildCircularMap(parsed, map);
    resolveCircularMap(map);

    return resolveMapRecursive(parsed, map);
  }

  export function serialize(t: any, currentPath: string[] = [], references: Map<number, string[]> = new Map(), index: number = 0): string {
    const mappedPaths = [...references.entries()];

    for (let i = 0; i < mappedPaths.length; i++) {
      const [mappedPathKey, mappedPath] = mappedPaths[i];
      let applies = true;

      for (let i = 0; i < mappedPath.length; i++) {
        if (currentPath[i] !== mappedPath[i]) {
          applies = false;
          break;
        }
      }

      if (applies) {
        return `<*${mappedPathKey}>`
      }
    }

    const cycles = getCycles(t);

    let prefix = cycles.length > 0 ? `<&${++index}>` : ""

    for (let i = 0; i < cycles.length; i++) {
      const cycle = cycles[i];
      references.set(index, cycle);
    }

    if (typeof t === "bigint") throw new Error("BigInt serialization not yet supported");
    if (typeof t === "boolean") return prefix + (t ? "true" : "false");
    if (typeof t === "function") throw new Error("Function serialization not yet supported");
    if (typeof t === "number") return prefix + t.toString();
    if (typeof t === "string") return prefix + `"${t}"`;
    if (typeof t === "symbol") throw new Error("Symbol serialization not yet supported");
    if (typeof t === "undefined") return prefix + "null";
    if (t === null) return prefix + "null";

    if (Array.isArray(t)) {
      return prefix + `[${t.map((element, idx) => serialize(element, [...currentPath, idx.toString()], references, index)).join(",")}]`;
    }

    let object = "{";

    for (const key in t) {
      if (Object.prototype.hasOwnProperty.call(t, key)) {
        const element = t[key];

        object += `"${key}":${serialize(element, [...currentPath, key.toString()], references, index)},`;
      }
    }

    return prefix + object + "}"
  };
}
