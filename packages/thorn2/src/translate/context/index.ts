import { render } from "../../errors/render";
import { ThornFunctionRefrence } from "../../refrences/thorn/function";
import { ThornVariableRefrence } from "../../refrences/thorn/variable";
import { ReferenceError } from "../../errors/refrenceError";
import { IdentifierNode } from "../../ast/node/identifier";
import { TokenRange } from "../../lexer/token";
import { Project, Sprite, Stage } from "petals-stem";

export class TranslationContext {
  protected readonly identifierRefrences: Map<string, ThornVariableRefrence | ThornFunctionRefrence>[] = [];
  protected target: Stage | Sprite | undefined = undefined;

  constructor(protected readonly project: Project) {}

  enterContext(map?: Map<string, ThornVariableRefrence | ThornFunctionRefrence>) {
    this.identifierRefrences.push(map ?? new Map());
  }

  exitContext() {
    this.identifierRefrences.pop();
  }

  getProject(): Project {
    return this.project;
  }

  setTarget(target: Stage | Sprite): void {
    this.target = target;
  }

  clearTarget() {
    this.target = undefined;
  }

  getTarget(): Stage | Sprite {
    if (this.target == undefined)
      throw new Error("Target missing from context");

    return this.target;
  }

  getTargetRaw(): Stage | Sprite | undefined {
    return this.target;
  }

  resolveIdentifier(identifier: IdentifierNode): ThornVariableRefrence | ThornFunctionRefrence {
    let val = undefined;

    for (const item of [...this.identifierRefrences].reverse()) {
      val = item.get(identifier.getIdentifier());

      if (val) break;
    }

    if (val == undefined) {
      render(new ReferenceError(`${identifier.getIdentifier()} is not defined`, identifier.getTokenRange()));
    }

    return val;
  }

  setIdentifier(identifier: string, reference: ThornVariableRefrence | ThornFunctionRefrence) {
    this.identifierRefrences[this.identifierRefrences.length - 1].set(identifier, reference);
  }
}
