import { StructureType, Type } from "../../types/ast/type";

export class StructTool {
  static getSize(type: Type): number {
    while (type.isReferenceType()) type = type.dereference();

    if (type.isStructureType()) {
      let size = 0;
  
      for (const entry of type.getValues().values()) {
        size += this.getSize(entry);
      }
  
      return size;
    }

    if (type.isUnionType()) {
      return Math.max(...type.getTypes().map(t => this.getSize(t)));
    }

    if (type.isListType()) {
      if (type.isDefinitelySized()) return type.getSize() * this.getSize(type.getContentType());

      throw new Error("Unsized lists are not supported in structs");
    }

    if (type.isReferenceType()) {
      return this.getSize(type.dereference());
    }

    return 1;
  }

  static getIndex(type: Type, path: string[]): number | undefined {
    if (path.length === 0) return 0;

    path = [...path];

    while (type.isReferenceType()) type = type.dereference();

    const localPath = path.shift()!;

    let index = 0;

    if (type.isStructureType()) {
      for (const [name, entry] of type.getValues()) {
        if (name !== localPath) {
          index += this.getSize(entry);

          continue;
        }

        const idx = this.getIndex(entry, path);

        if (idx === undefined) return undefined;

        return index + idx;
      }
    }

    if (type.isListType()) {
      const listIndex = parseInt(localPath);

      if (!type.isDefinitelySized()) {
        throw new Error("Unsized lists are not supported in structs");
      }

      if (isNaN(listIndex) || !isFinite(listIndex)) {
        throw new Error(`Invalid listIndex ${localPath}`);
      }

      if (listIndex > type.getSize() || listIndex < type.getSize()) {
        throw new Error(`listIndex ${listIndex} out of bounds`);
      }

      index = this.getSize(type.getContentType());

      const idx = this.getIndex(type.getContentType(), path);

      if (idx === undefined) return undefined;

      return index + idx;
    }

    if (type.isUnionType()) {
      const validIndexes = type.getTypes().map(t => this.getIndex(t, path)).filter(t => t !== undefined) as number[];

      if (validIndexes.length === 0) return undefined;

      if (validIndexes.every(i => i === validIndexes[0])) {
        return validIndexes[0];
      }

      throw new Error(`Ambiguous path`);
    }

    return 0;
  }

  static getPath(type: Type, index: number): (string | number)[][] {
    if (index < 0) throw new Error(`Invalid index ${index}`);

    while (type.isReferenceType()) type = type.dereference();

    if (type.isStructureType()) {
      let offset = 0;

      for (const [name, entry] of type.getValues()) {
        const size = this.getSize(entry);

        if (offset + size <= index) {
          offset += size;
          continue;
        }

        return this.getPath(entry, index - offset).map(e => [name, ...e]);
      }

      throw new Error(`Invalid index ${index}`);
    }

    if (type.isListType()) {
      if (!type.isDefinitelySized()) {
        throw new Error("Unsized lists are not supported in structs");
      }

      const size = this.getSize(type.getContentType());

      const listIndex = Math.floor(index / size);

      return this.getPath(type.getContentType(), index % size).map(e => [listIndex, ...e]);
    }

    if (type.isUnionType()) {
      return type.getTypes().map(t => this.getPath(t, index)).flat(1).filter(p => p.length > 0);
    }

    if (index === 0) return [[]];

    return [];
  }
}