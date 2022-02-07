import { Variable } from "petals-stem/dist/src/variable";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { List } from "petals-stem/dist/src/list";
import { ID } from "petals-stem/dist/src/id";
import { ListType, StructureType, Type } from "../../types/ast/type";
import { StructDefinitionNode } from "../../types/ast/nodes/structDefinitionNode";
import { HeapOptions } from "../../types/ast/nodes/heapDefinitionNode";
import { VariableReference } from "./reference/variable/abstract";
import { VariableInstanceReference } from "./reference/variable/instanceReference";
import { VariableFunctionStackReference } from "./reference/variable/functionStackReference";
import { ListReference } from "./reference/list/abstract";
import { ListInstanceReference } from "./reference/list/instanceReference";
import { KnownLengthInstanceReference } from "./reference/list/knownLengthInstanceReference";
import { Procedures } from "petals-stem/dist/src/block/category/procedures";
import { Variables } from "petals-stem/dist/src/block/category/variables";
import { Argument } from "petals-stem/dist/src/block/category/argument";
import { Input } from "petals-stem/dist/src/block/input";
import { Operators } from "petals-stem/dist/src/block/category/operators";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { Control } from "petals-stem/dist/src/block/category/control";
import { StringInput } from "petals-stem/dist/src/block/input/string";
import { getType } from "./getType";
import { FunctionArgumentReference } from "./reference/variable/functionArgument";

export type HeapReferenceData = { heap: ListReference, heapIndexes: ListReference, options: HeapOptions, mallocReturn: VariableReference, malloc: InstanceType<typeof Procedures.Definition>, free: InstanceType<typeof Procedures.Definition> };

export class Context {
  protected variableStack: Map<string, Variable | List>[] = [];
  protected listStack: Map<string, List>[] = [];
  protected methodArgsStack: { name: string, type: Type }[][] = [];

  protected typeStore: Map<List | Variable | string, Type> = new Map();
  protected heapStore: Map<string, HeapReferenceData> = new Map();

  protected structDefinitions: Map<string, StructureType> = new Map();

  protected recursiveVariableDefinitions: List[] = [];
  protected inRecursiveMethod: boolean = false;
  protected returnVariables: Record<string, Variable | List> = {};
  protected currentMethod: string | undefined;

  constructor(public readonly target: Target, public readonly mainThread: Block) {
    this.createHeap("global", { maxSize: 200000 })
  }

  setType(item: List, type: ListType): this
  setType(item: Variable | string, type: Type): this
  setType(item: Variable | List | string, type: Type): this
  setType(item: List | Variable | string, type: Type): this {
    this.typeStore.set(item, type);
    return this;
  }

  getType(item: List): ListType | undefined
  getType(item: Variable | string): Type | undefined
  getType(item: Variable | List | string): Type | undefined
  getType(item: List | Variable | string): Type | undefined {
    return this.typeStore.get(item);
  }

  enter() {
    this.variableStack.push(new Map());
    this.listStack.push(new Map());
  }

  enterMethod(methodName: string, args: { name: string, type: Type }[], returnType: Type, recursive: boolean) {
    this.methodArgsStack.push(args);
    this.currentMethod = methodName;

    while (returnType.isReferenceType()) {
      returnType.loadIntoContext(this);
      returnType = returnType.dereference();
    }

    if (returnType.isStructureType() || returnType.isListType()) {
      this.returnVariables[methodName] = this.target.getLists().createList(ID.generate() + "-ret_" + methodName, []);
    } else {
      this.returnVariables[methodName] = this.target.getVariables().createVariable(ID.generate() + "-ret_" + methodName, 0);
    }

    this.setType(this.returnVariables[methodName], returnType);

    if (recursive) {
      this.inRecursiveMethod = true;
      this.recursiveVariableDefinitions = [];
    }
  }

  getReturnVariable(): VariableReference | ListReference | undefined {
    return this.currentMethod 
      ? this.returnVariables[this.currentMethod] instanceof Variable ? new VariableInstanceReference(this.returnVariables[this.currentMethod] as Variable)
      : new ListInstanceReference(this.returnVariables[this.currentMethod] as List)
      : undefined;
  }

  getReturnVariableForMethod(methodName: string): VariableReference | ListReference {
    const v = this.returnVariables[methodName];
    let type = this.getType(methodName);

    if (v instanceof Variable) {
      return new VariableInstanceReference(v);
    }

    while (type && type.isReferenceType()) type = type.dereference();

    if (type && (type.isStructureType() || (type.isListType() && type.isDefinitelySized()))) {
      return new KnownLengthInstanceReference(v, type);
    }

    return new ListInstanceReference(v);
  }

  exit() {
    this.variableStack.pop();
    this.listStack.pop();
  }

  exitMethod() {
    this.methodArgsStack.pop();

    this.inRecursiveMethod = false;
    this.currentMethod = undefined;

    return this.recursiveVariableDefinitions;
  }

  createVariable(name: string, value: string | number, type: Type): VariableReference {
    if (this.hasVariable(name)) {
      throw new Error(`Cannot re-create variable ${name}, already exists in context`);
    }

    if (this.inRecursiveMethod) {
      const newVar = this.target.getLists().createList(ID.generate() + "-" + name, []);
      if (type) this.setType(newVar, type)
      this.recursiveVariableDefinitions.push(newVar);
      this.variableStack[this.variableStack.length - 1].set(name, newVar);
      return new VariableFunctionStackReference(newVar, type);
    }

    const newVar = this.target.getVariables().createVariable(ID.generate() + "-" + name, value ?? 0);
    if (type) this.setType(newVar, type)
    this.variableStack[this.variableStack.length - 1].set(name, newVar);
    return new VariableInstanceReference(newVar);
  }

  createList(name: string, value: string[], type: Type): List {
    if (this.hasList(name)) {
      throw new Error(`Cannot re-create list ${name}, already exists in context`);
    }

    if (this.inRecursiveMethod && !type.isStructureType()) {
      throw new Error(`Cannot create list ${name} in recursive method`);
    }

    const newList = this.target.getLists().createList(ID.generate() + "-" + name, value);
    this.setType(newList, type)
    this.listStack[this.listStack.length - 1].set(name, newList);

    if (this.isInRecursiveMethod())
      this.recursiveVariableDefinitions.push(newList);

    return newList;
  }

  hasVariable(name: string): boolean {
    for (let i = this.variableStack.length - 1; i >= 0; i--) {
      const varMap = this.variableStack[i];
      if (varMap.has(name)) {
        return true;
      }
    }

    for (let i = 0; i < this.methodArgsStack.length; i++) {
      const str = this.methodArgsStack[i];
      if (str.find(t => t.name === name)) return true;
    }

    return false;
  }

  hasList(name: string): boolean {
    for (let i = this.listStack.length - 1; i >= 0; i--) {
      const listMap = this.listStack[i];
      if (listMap.has(name)) {
        return true;
      }
    }

    return false;
  }

  getVariable(name: string): Variable | List | { name: string, type: Type } {
    for (let i = this.variableStack.length - 1; i >= 0; i--) {
      const varMap = this.variableStack[i];
      if (varMap.has(name)) {
        return varMap.get(name)!;
      }
    }

    for (let i = 0; i < this.methodArgsStack.length; i++) {
      const str = this.methodArgsStack[i];
      const v = str.find(v => v.name === name);
      if (v) return v;
    }

    throw new Error(`Variable ${name} not found in context`);
  }

  getList(name: string): List | VariableReference {
    for (let i = this.listStack.length - 1; i >= 0; i--) {
      const listMap = this.listStack[i];
      if (listMap.has(name)) {
        return listMap.get(name)!;
      }
    }

    for (let i = 0; i < this.variableStack.length; i++) {
      const variableMap = this.variableStack[i];
      if (variableMap.has(name)) {
        const v = variableMap.get(name)!;
        const t = getType(v, this);

        if (t.isHeapReferenceType()) {
          if (v instanceof List) throw new Error("Cannot dereference list");

          return new VariableInstanceReference(v);
        }
      }
    }

    const flatArgs = this.methodArgsStack.flat();

    for (let i = 0; i < flatArgs.length; i++) {
      const arg = flatArgs[i];

      if (arg.name === name) {
        return new FunctionArgumentReference(arg.name);
      }
    }

    throw new Error(`List ${name} not found in context`);
  }

  defineStruct(name: string, type: StructureType) {
    this.structDefinitions.set(name, type);
  }

  getStruct(name: string): StructureType {
    if (!this.structDefinitions.has(name)) {
      throw new Error(`Structure ${name} not found in context`);
    }

    return this.structDefinitions.get(name)!;
  }

  hasStruct(name: string): boolean {
    return this.structDefinitions.has(name);
  }

  isInRecursiveMethod(): boolean {
    return this.inRecursiveMethod;
  }

  createHeap(name: string, options: HeapOptions): void {
    const blockFactory = this.target.getBlocks();
    const getArg = (name: string) => Input.shadowed(blockFactory.createBlock(Argument.ReporterStringNumber, name));

    const heap = this.target.getLists().createList("___heap_" + name, []);
    const heapIndexes = this.target.getLists().createList("___heap_" + name + "_indexes", []);
    const freeHeapIndexes = this.target.getLists().createList("___heap_" + name + "_free_indexes", []);

    // code for the free function

    const free = this.target.getBlocks().createCustomBlockHat(ID.generate() + "-___heap_" + name + "_free", [{ name: "ptr", type: "string", defaultValue: "" }]);
    const freeElemPtr = this.target.getVariables().createVariable(ID.generate() + "-___heap_" + name + "_free_elem_ptr", 0);
    const freeElemSize = this.target.getVariables().createVariable(ID.generate() + "-___heap_" + name + "_free_elem_size", 0);
    const freeIter = this.target.getVariables().createVariable(ID.generate() + "-___heap_" + name + "_free_iter", 0);

    free.append(this.target.getBlocks().generateStack(function* () {
      yield new Variables.SetVariableTo(freeElemPtr, Input.shadowed(blockFactory.createBlock(Variables.ItemOfList, heapIndexes, getArg("ptr"))));
      yield new Variables.AddToList(freeHeapIndexes, getArg("ptr"));
      yield new Variables.SetVariableTo(freeElemSize, Input.shadowed(blockFactory.createBlock(Operators.Add, 1, 
        Input.shadowed(blockFactory.createBlock(Variables.ItemOfList, heap, Input.shadowed(new VariableInput(freeElemPtr))))
      )));
      yield new Variables.DeleteOfList(heap, Input.shadowed(new VariableInput(freeElemPtr)));
      yield new Control.Repeat(Input.shadowed(blockFactory.createBlock(Operators.Subtract, Input.shadowed(new VariableInput(freeElemSize)), 1)), blockFactory.generateStack(function* () {
        yield new Variables.DeleteOfList(heap, Input.shadowed(new VariableInput(freeElemPtr)));
      }));
      yield new Variables.SetVariableTo(freeIter, Input.shadowed(blockFactory.createBlock(Operators.Add, 1, getArg("ptr"))));
      yield new Control.Repeat(Input.shadowed(blockFactory.createBlock(Operators.Subtract, Input.shadowed(blockFactory.createBlock(Variables.LengthOfList, heapIndexes)), getArg("ptr"))), blockFactory.generateStack(function* () {
        yield new Variables.ReplaceItemOfList(heapIndexes, Input.shadowed(new VariableInput(freeIter)), Input.shadowed(blockFactory.createBlock(Operators.Subtract, Input.shadowed(blockFactory.createBlock(Variables.ItemOfList, heapIndexes, Input.shadowed(new VariableInput(freeIter)))), Input.shadowed(new VariableInput(freeElemSize)))));
        yield new Variables.ChangeVariableBy(freeIter, 1);
      }));
    }));

    const malloc = this.target.getBlocks().createCustomBlockHat(ID.generate() + "-___heap_" + name + "_malloc", [{ name: "size", type: "string", defaultValue: "" }]);
    const mallocReturn = this.target.getVariables().createVariable(ID.generate() + "-___heap_" + name + "_malloc_return", 0);

    malloc.append(this.target.getBlocks().generateStack(function* () {
      yield new Control.IfElse(
        blockFactory.createBlock(Operators.Gt, Input.shadowed(blockFactory.createBlock(Operators.Add, getArg("size"), Input.shadowed(blockFactory.createBlock(Variables.LengthOfList, heap)))), 200000), blockFactory.generateStack(function* () {
          yield new Variables.SetVariableTo(mallocReturn, Input.shadowed(new StringInput("HEAP_FULL_ERROR")));
        }), blockFactory.generateStack(function* () {
          yield new Control.IfElse(
            blockFactory.createBlock(Operators.Lt, Input.shadowed(blockFactory.createBlock(Variables.LengthOfList, heapIndexes)), 200000), blockFactory.generateStack(function* () {
              yield new Variables.AddToList(heapIndexes, Input.shadowed(blockFactory.createBlock(Operators.Add, 1, Input.shadowed(blockFactory.createBlock(Variables.LengthOfList, heap)))));
              yield new Variables.SetVariableTo(mallocReturn, Input.shadowed(blockFactory.createBlock(Variables.LengthOfList, heapIndexes)));
            }), blockFactory.generateStack(function* () {
              yield new Variables.ReplaceItemOfList(
                heapIndexes,
                Input.shadowed(blockFactory.createBlock(Variables.ItemOfList, freeHeapIndexes, Input.shadowed(blockFactory.createBlock(Variables.LengthOfList, freeHeapIndexes)))),
                Input.shadowed(blockFactory.createBlock(Operators.Add, 1, Input.shadowed(blockFactory.createBlock(Variables.LengthOfList, heap)))),
              );
              yield new Variables.SetVariableTo(mallocReturn, Input.shadowed(blockFactory.createBlock(Variables.ItemOfList, freeHeapIndexes, Input.shadowed(blockFactory.createBlock(Variables.LengthOfList, freeHeapIndexes)))));
              yield new Variables.DeleteOfList(freeHeapIndexes, Input.shadowed(blockFactory.createBlock(Variables.LengthOfList, freeHeapIndexes)));
            }),
          )
          yield new Variables.AddToList(heap, getArg("size"));
          yield new Control.Repeat(getArg("size"), blockFactory.generateStack(function* () {
            yield new Variables.AddToList(heap, "");
          }))
        })
      )
    }))

    this.heapStore.set(name, { heap: new ListInstanceReference(heap), heapIndexes: new ListInstanceReference(heapIndexes), options, free, malloc, mallocReturn: new VariableInstanceReference(mallocReturn) });
  }

  getHeap(name?: string): HeapReferenceData {
    if (name) {
      if (!this.heapStore.has(name)) {
        throw new Error(`Heap ${name} not found in context`);
      }

      return this.heapStore.get(name)!;
    }

    return this.heapStore.get("global")!;
  }
}

export function typeApplyContext(t: Type, ctx: Context): void {
  while (t.isHeapReferenceType()) t = t.dereference();

  if (t.isListType()) {
    return typeApplyContext(t.getContentType(), ctx);
  }

  if (t.isReferenceType()) {
    t.loadIntoContext(ctx);
    return;
  }

  if (t.isUnionType()) {
    t.getTypes().forEach((t) => typeApplyContext(t, ctx));
  }

  if (t.isStructureType()) {
    for (const field of t.getValues().values()) {
      typeApplyContext(field, ctx);
    }
  }
}
