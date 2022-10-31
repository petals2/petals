import { SiteProject } from "../project/project";
import type { User } from "./user";
import { Client } from "..";
import { SortFormat } from "../../api";
import { ProjectStore } from "./projectStore";

const defaultConfig: ClientProjectStoreConfig = {
  chunkSize: 15,
  filter: "all",
}

interface ClientProjectStoreConfig {
  chunkSize: number,
  filter: "all" | "shared" | "notshared" | "trashed",
  sortKind?: "title" | "view_count" | "love_count" | "remixers_count",
  sortFormat?: SortFormat,
}

export class ClientProjectStore extends ProjectStore {
  protected readonly config: ClientProjectStoreConfig;

  constructor(protected readonly client: Client, protected readonly user: User, config: Partial<ClientProjectStoreConfig> = {}) {
    super(client, user);
    this.config = { ...defaultConfig, ...config };
  }

  async *[Symbol.asyncIterator](): AsyncIterator<SiteProject, void, void> {
    // page starts at 1
    let page = 1;

    while (true) {
      const chunk = await this.client.getRequestor().getOwnProjects(page, this.config.filter, this.config.sortKind, this.config.sortFormat);

      if (chunk.length === 0) break;

      page++;

      for (const message of chunk) {
        yield new SiteProject(this.client, message, this.user);
      }

      if (chunk.length < this.config.chunkSize) break;
    }
  }

  async all(): Promise<SiteProject[]> {
    const projects = [];

    for await (const project of this) {
      projects.push(project);
    }

    return projects;
  }

  chunkSize(size: number): this {
    this.config.chunkSize = size;
    return this;
  }

  filter(filter: "all" | "shared" | "notshared" | "trashed"): this {
    this.config.filter = filter;
    return this;
  }

  sortAscending(sort: "title" | "view_count" | "love_count" | "remixers_count"): this {
    this.config.sortKind = sort;
    this.config.sortFormat = SortFormat.Ascending;
    return this;
  }

  sortDescending(sort: "title" | "view_count" | "love_count" | "remixers_count"): this {
    this.config.sortKind = sort;
    this.config.sortFormat = SortFormat.Descending;
    return this;
  }
}
