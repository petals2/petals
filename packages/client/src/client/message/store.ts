import { Message as MessageType } from "../../api/interfaces/message";
import { Requestor } from "../../api";
import { Message } from ".";
import { Client } from "..";

const defaultConfig: MessageStoreConfig = {
  chunkSize: 15,
}

interface MessageStoreConfig {
  chunkSize: number,
  filter?: "comments" | "projects" | "studios" | "forums",
}

export class MessageStore {
  protected readonly config: MessageStoreConfig;

  constructor(protected readonly client: Client, config: Partial<MessageStoreConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async *[Symbol.asyncIterator](): AsyncIterator<Message, void, void> {
    let head = 0;

    while (true) {
      const chunk = await this.client.getRequestor().getMessages(this.client.getUsername(), this.config.chunkSize, head);

      if (!Array.isArray(chunk)) throw new Error(`Error while fetching messages. ${chunk.code}: ${chunk.message}`);

      if (chunk.length === 0) break;

      head += chunk.length;

      for (const message of chunk) {
        yield Message.fromJSON(this.client, message);
      }

      if (chunk.length < this.config.chunkSize) break;
    }
  }

  chunkSize(size: number): MessageStore {
    this.config.chunkSize = size;
    return this;
  }

  filter(filter: "comments" | "projects" | "studios" | "forums"): MessageStore {
    this.config.filter = filter;
    return this;
  }

  removeFilter(): MessageStore {
    this.config.filter = undefined;
    return this;
  }

  markAsRead(): Promise<void> {
    return this.client.getRequestor().clearMessage();
  }
}
