import { SiteProject } from "../project/project";
import type { User } from "./user";
import { Client } from "..";

const defaultConfig: FavoriteStoreConfig = {
  chunkSize: 15,
}

interface FavoriteStoreConfig {
  chunkSize: number,
}

export class FavoriteStore {
  protected readonly config: FavoriteStoreConfig;

  constructor(protected readonly client: Client, protected readonly user: User, config: Partial<FavoriteStoreConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async *[Symbol.asyncIterator](): AsyncIterator<SiteProject, void, void> {
    let head = 0;

    while (true) {
      const chunk = await this.client.getRequestor().getUserFavorites(await this.user.getUsername(), this.config.chunkSize, head);

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
}
