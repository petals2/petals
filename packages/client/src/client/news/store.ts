import { NewsItem } from "./news";
import { Client } from "..";

const defaultConfig: NewsStoreConfig = {
  chunkSize: 15,
}

interface NewsStoreConfig {
  chunkSize: number,
}

export class NewsStore {
  protected readonly config: NewsStoreConfig;

  constructor(protected readonly client: Client, config: Partial<NewsStoreConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async *[Symbol.asyncIterator](): AsyncIterator<NewsItem, void, void> {
    let head = 0;

    while (true) {
      const chunk = await this.client.getRequestor().getNews(this.config.chunkSize, head);

      if (chunk.length === 0) break;

      head += chunk.length;

      for (const message of chunk) {
        yield new NewsItem(message);
      }

      if (chunk.length < this.config.chunkSize) break;
    }
  }

  chunkSize(size: number): this {
    this.config.chunkSize = size;
    return this;
  }
}
