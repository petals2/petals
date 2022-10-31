import type { Project, ProjectReference } from ".";
import { BlockStore, Target } from "..";

export class DeserializationContext {
  protected currentTarget: Target | undefined;
  protected currentBlockStore: BlockStore | undefined;

  constructor(
    protected project: Project,
    protected projectReference: ProjectReference,
  ) {}

  getProject(): Project { return this.project }
  getProjectReference(): ProjectReference { return this.projectReference }
  getCurrentTarget(): Target | undefined { return this.currentTarget }
  setCurrentTarget(t: Target | undefined) { this.currentTarget = t }
  getCurrentBlockStore(): BlockStore | undefined { return this.currentBlockStore }
  setCurrentBlockStore(t: BlockStore | undefined) { this.currentBlockStore = t }
}
