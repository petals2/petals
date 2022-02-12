import { SiteProject } from "./project";
import { Client } from "..";
import { ProjectComment } from "./comments/comment";

const defaultConfig: ProjectCommentStoreConfig = {
  chunkSize: 15,
}

interface ProjectCommentStoreConfig {
  chunkSize: number,
}

export class ProjectCommentStore {
  protected readonly config: ProjectCommentStoreConfig;

  constructor(protected readonly client: Client, protected readonly project: SiteProject, config: Partial<ProjectCommentStoreConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async *[Symbol.asyncIterator](): AsyncIterator<ProjectComment, void, void> {
    let head = 0;

    while (true) {
      const chunk = await this.client.getRequestor().getProjectComments(await this.project.getId(), await (await this.project.getAuthor()).getUsername(), this.config.chunkSize, head);

      if (chunk.length === 0) break;

      head += chunk.length;

      for (const message of chunk) {
        yield new ProjectComment(this.client, this.project, message);
      }

      if (chunk.length < this.config.chunkSize) break;
    }
  }

  chunkSize(size: number): this {
    this.config.chunkSize = size;
    return this;
  }
}
