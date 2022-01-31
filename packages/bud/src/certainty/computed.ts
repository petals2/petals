import path from "path";
import type { CollectedTerms } from "./collectedTerms";

export abstract class Computed {
    private _stackTrace: string[];

    constructor() {
        this._stackTrace = [];
        try {
            throw new Error;
        } catch (e: any) {
            const allLines: string[] = e.stack.split("\n");
            const lines = allLines.slice(3, 5);
            for (const relevantLine of lines) {
                const brackets: string[]|null = relevantLine.match(/\(.+\)/g);
                if (!brackets)
                    return;
    
                const inner = brackets[0].substring(1, brackets[0].length - 2);
                this._stackTrace.push(path.basename(inner));
            }
        }
    }

    abstract collectLikeTerms(): CollectedTerms;
    abstract equalTo(other: Computed): Computed;
}
