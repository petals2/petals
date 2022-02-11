import { Block, SerializedBlock } from "./block";
import { Argument } from "./category/argument";
import { Procedures } from "./category/procedures";
import * as esprima from "esprima";
import { ID } from "../id";
import { Input } from "./input";
import { Project } from "..";
import { ProjectReference } from "../project/projectReference";

export type SerializedBlockStore = Record<string, SerializedBlock>;

export class BlockStore {
  private _store: Map<string, Block> = new Map();
  private _customBlockRefs: Map<string, InstanceType<typeof Procedures.Prototype>> = new Map();

  static fromReference(project: Project, reference: ProjectReference, json: SerializedBlockStore) {
    const blockStore = new BlockStore;
    blockStore.deserialize(project, reference, json);
    return blockStore;
  }

  findBlockById(id: string): Block | undefined {
    return this._store.get(id);
  }

  getBlockById(id: string): Block {
    const result = this.findBlockById(id);

    if (result === undefined)
      throw new Error("Failed to find block by id: " + id);

    return result;
  }

  createBlock<T extends new (...args: any) => any>(klass: T, ...args: T extends new (...args: infer A) => any ? A : never): T extends new (...args: any) => infer A ? A : never {
    const block = new klass(...args as any);
    this._store.set(block.getId(), block);
    return block;
  }

  removeStack(stack: Block): void {
    while(true) {
      this.removeBlock(stack);

      if (!stack.hasNext()) return;

      stack = stack.next();
    }
  }

  removeStackById(id: string): void {
    this.removeStack(this.getBlockById(id));
  }

  removeBlockOnly(block: Block): void {
    this._store.delete(block.getId());

    if (block.hasNext() && block.hasParent()) block.next().setParent(block.getParent()!);
    if (block.hasParent() && block.getParent()!.getNext() === block) block.getParent()!.setNext(block.getNext());
  }

  removeBlock(block: Block): void {
    this.removeBlockOnly(block);

    for (let testBlock of this._store.values()) {
      for (let [name, input] of (testBlock as any).inputs.entries() as IterableIterator<[string, Input]>) {
        const bottomLayer = input.getBottomLayer();

        if (bottomLayer instanceof Block && bottomLayer === block) {
          input.setBottomLayer(block.getNext());
        }

        const topLayer = input.getTopLayer();

        if (topLayer instanceof Block && topLayer === block) {
          if (block.hasNext()) {
            input.setTopLayer(block.next());
          } else {
            if (input.getBottomLayer() !== undefined) {
              input.setTopLayer(input.getBottomLayer()!);
            } else {
              (testBlock as any as { inputs: Map<string, any> }).inputs.delete(name);
            }
          }
        }
      }
    }

    for (const input of block.getChildren()) {
      this.removeStack(input);
    }
  }

  removeBlockById(id: string): void {
    this.removeBlock(this.getBlockById(id));
  }

  generateStack(gen: () => Generator<Block, void, void>): Block {
    const inst = gen();

    let cursor = inst.next().value;

    if (cursor === undefined) throw new Error("Generator never yielded a block");

    this._store.set(cursor.getId(), cursor);

    for (const block of inst) {
      cursor = cursor.append(block);
      this._store.set(cursor.getId(), cursor);
    }

    return cursor.getHead();
  }

  insertStackAfter(stack: Block, location: Block) {
    const nextNext = location.getNext();
    location.setNext(stack.getTail());
    if (nextNext) {
      stack.getTail().setNext(nextNext);
    }
  }

  createCustomBlockHat(procCode: string, params: ({ type: "string", name: string, defaultValue: string } | { type: "boolean", name: string, defaultValue: boolean })[]): InstanceType<typeof Procedures.Definition> {
    const defaultVals = params.map(a => a.defaultValue);
    let uneditedProcCode = procCode;

    const blocks = params.map(a => {
      if (a.type == "string") {
        procCode += " %s"

        return this.createBlock(Argument.ReporterStringNumber, a.name);
      }

      if (a.type == "boolean") {
        procCode += " %b"

        return this.createBlock(Argument.ReporterBoolean, a.name);
      }

      throw new Error("Unknown argument type: " + (a as any).type);
    });

    const prototype = this.createBlock(Procedures.Prototype, procCode, blocks, defaultVals);

    blocks.forEach(b => b.setParent(prototype));

    this._customBlockRefs.set(uneditedProcCode, prototype);
    return this.createBlock(Procedures.Definition, prototype);
  }

  createCustomBlockDefinition(func: (...a: (() => Input)[]) => Generator<Block, void, void>): InstanceType<typeof Procedures.Definition> {
    const parsed = esprima.parseScript(func.toString());

    if (parsed.body.length !== 1) throw new Error("Unexpected body size. Expected exactly one FunctionDeclaration");

    const [decl] = parsed.body;

    if (decl.type !== "FunctionDeclaration") throw new Error("Unexpected body type. Expected FunctionDeclaration");
    if (decl.generator === false) throw new Error("Unexpected missing generator flag. Expected true");
    if (decl.async === true) throw new Error("Unexpected async flag. Expected false");

    const name = decl.id?.name ?? `AnonymousFunction-${ID.generate()}`;

    const params = decl.params.map(p => {
      if (p.type === "Identifier") {
        return <const> { type: "string", name: p.name, defaultValue: "" };
      }

      if (p.type === "AssignmentPattern") {
        if (p.left.type !== "Identifier") throw new Error("Unexpected left type. Expected Identifier");
        if (p.right.type !== "Literal") throw new Error("Unexpected right type. Expected Literal");

        if (typeof p.right.value === "boolean") {
          return <const> { type: "boolean", name: p.left.name, defaultValue: p.right.value };
        }

        if (typeof p.right.value === "string" || typeof p.right.value === "number") {
          return <const> { type: "string", name: p.left.name, defaultValue: p.right.value.toString() };
        }

        throw new Error("Unexpected right value type. Expected string or boolean");
      }

      throw new Error("Unexpected parameter type");
    });

    let cursor: Block = this.createCustomBlockHat(name, params);

    const arg = (cursor as InstanceType<typeof Procedures.Definition>).getPrototype().getArguments().map(arg => {
      return () => {
        if (arg instanceof Argument.ReporterBoolean) {
          return Input.shadowed(this.createBlock(Argument.ReporterBoolean, arg.getName()));
        }

        if (arg instanceof Argument.ReporterStringNumber) {
          return Input.shadowed(this.createBlock(Argument.ReporterStringNumber, arg.getName()));
        }

        throw new Error("Unexpected argument type");
      }
    })

    const f = func(...arg);

    for (const block of f) {
      cursor = cursor.append(block);
      this._store.set(cursor.getId(), cursor);
    }

    return (cursor.getHead() as InstanceType<typeof Procedures.Definition>);
  }

  deserialize(project: Project, reference: ProjectReference, json: SerializedBlockStore) {
    const blockEntries = Object.entries(json);
    for (const [ blockId, blockJson ] of blockEntries) {
      
    }
  }

  serialize(): SerializedBlockStore {
    let store: SerializedBlockStore = {};

    for (const block of this._store.values()) {
      if (block.getOpcode() === "__phantom__") {
        this.removeBlock(block);
      }
    }

    for (const block of this._store.values()) {
      store[block.getId()] = block.serialize();
    }

    return store;
  }

  getCustomBlockByName(name: string): InstanceType<typeof Procedures.Definition> | undefined {
    return this._customBlockRefs.get(name)?.getParent() as InstanceType<typeof Procedures.Definition> | undefined;
  }

  * getAllBlockHeads() {
    for (const block of this._store.values()) {
      if (block.isHead()) {
        yield block;
      }
    }
  }
}
