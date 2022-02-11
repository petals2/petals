import { SiteProject } from ".";
import { Client } from "..";

const defaultConfig: RemixStoreConfig = {
  chunkSize: 15,
}

interface RemixStoreConfig {
  chunkSize: number,
}

export class RemixStore {
  protected readonly config: RemixStoreConfig;

  constructor(protected readonly client: Client, protected readonly baseProject: SiteProject, config: Partial<RemixStoreConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async *[Symbol.asyncIterator](): AsyncIterator<SiteProject, void, void> {
    let head = 0;

    while (true) {
      const chunk = await this.client.getRequestor().getProjectRemixes(await this.baseProject.getId(), this.config.chunkSize, head);

      if (chunk.length === 0) break;

      head += chunk.length;

      for (const message of chunk) {
        yield new SiteProject(this.client, message);
      }

      if (chunk.length < this.config.chunkSize) break;
    }
  }

  chunkSize(size: number): this {
    this.config.chunkSize = size;
    return this;
  }

  async root(): Promise<SiteProject | null> {
    if ((this.baseProject as any).remixRoot === undefined) await this.baseProject.fetch();

    return (this.baseProject as any).remixRoot;
  }

  async parent(): Promise<SiteProject | null> {
    if ((this.baseProject as any).remixParent === undefined) await this.baseProject.fetch();

    return (this.baseProject as any).remixParent;
  }

  async count(): Promise<number> {
    if ((this.baseProject as any).remixCount === undefined) await this.baseProject.fetch();

    return (this.baseProject as any).remixCount;
  }
}
