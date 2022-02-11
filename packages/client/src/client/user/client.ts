import { User as UserType } from "../../api/interfaces/user";
import { Client } from "..";
import { User } from ".";
import { ClientProjectStore } from "./clientProjectStore";

export class ClientUser extends User {
  constructor(client: Client, usernameOrUser: Partial<UserType> | string, protected clientCache: Partial<{ token: string, email: string, banned: boolean }>) {
    super(client, usernameOrUser);
  }

  async fetchClient() {
    this.clientCache = (await this.client.refreshSession()).user;
  }

  async getToken(): Promise<string> {
    if (this.clientCache.token === undefined) await this.fetchClient();

    return this.clientCache.token!;
  }

  async getEmail(): Promise<string> {
    if (this.clientCache.email === undefined) await this.fetchClient();

    return this.clientCache.email!;
  }

  async getBanned(): Promise<boolean> {
    if (this.clientCache.banned === undefined) await this.fetchClient();

    return this.clientCache.banned!;
  }

  projects(): ClientProjectStore { return new ClientProjectStore(this.client, this) }
}
