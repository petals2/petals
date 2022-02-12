import { SiteProject } from "..";
import { Client } from "../..";
import { ProjectComment } from "../comments";

const defaultConfig: ProjectCommentReplyStoreConfig = {
  chunkSize: 15,
}

interface ProjectCommentReplyStoreConfig {
  chunkSize: number,
}

export class ProjectCommentReplyStore {
  protected readonly config: ProjectCommentReplyStoreConfig;

  constructor(protected readonly client: Client, protected readonly project: SiteProject, protected readonly parent: ProjectComment, config: Partial<ProjectCommentReplyStoreConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async *[Symbol.asyncIterator](): AsyncIterator<ProjectComment, void, void> {
    let head = 0;

    if (this.count() === 0) return;

    while (true) {
      const chunk = await this.client.getRequestor().getProjectCommentReplies(await this.project.getId(), await (await this.project.getAuthor()).getUsername(), this.parent.getId().toString(), this.config.chunkSize, head);

      if (chunk.length === 0) break;

      head += chunk.length;

      for (const message of chunk) {
        yield new ProjectComment(this.client, this.project, message, this.parent);
      }

      if (chunk.length < this.config.chunkSize) break;
    }
  }

  chunkSize(size: number): this {
    this.config.chunkSize = size;
    return this;
  }

  count(): number {
    return (this.parent as any).comment.reply_count;
  }
}
