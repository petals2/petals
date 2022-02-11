import { SiteProject } from "../project";
import type { User } from ".";
import { Client } from "..";

const defaultConfig: ProjectStoreConfig = {
  chunkSize: 15,
}

interface ProjectStoreConfig {
  chunkSize: number,
}

export class ProjectStore {
  protected readonly config: ProjectStoreConfig;

  constructor(protected readonly client: Client, protected readonly user: User, config: Partial<ProjectStoreConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async *[Symbol.asyncIterator](): AsyncIterator<SiteProject, void, void> {
    let head = 0;

    while (true) {
      const chunk = await this.client.getRequestor().getUserProjects(await this.user.getUsername(), this.config.chunkSize, head);

      if (chunk.length === 0) break;

      head += chunk.length;

      for (const message of chunk) {
        yield new SiteProject(this.client, message, this.user);
      }

      if (chunk.length < this.config.chunkSize) break;
    }
  }

  chunkSize(size: number): this {
    this.config.chunkSize = size;
    return this;
  }
}
