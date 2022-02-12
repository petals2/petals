import { User as UserType } from "../../api/interfaces/user";
import { Client } from "..";
import { ProjectStore } from "./projectStore";
import { FavoriteStore } from "./favoriteStore";

export class User {
  protected cache: Partial<UserType> & { username: string };

  constructor(protected readonly client: Client, usernameOrUser: Partial<UserType> | string) {
    if (typeof usernameOrUser === "string") {
      this.cache = { username: usernameOrUser };
    } else {
      if (usernameOrUser.username === undefined) throw new Error("Username is undefined.");

      this.cache = usernameOrUser as Partial<UserType> & { username: string };
    }
  }

  async fetch(): Promise<void> {
    const user = await this.client.getRequestor().getUserByUsername(this.client.getUsername());

    if ("code" in user) throw new Error(`Error while fetching user. ${user.code}: ${user.message}`);

    this.cache = user;
  }

  async getUsername(): Promise<string> {
    return this.cache.username;
  }

  async getId(): Promise<number> {
    if (this.cache.id === undefined) await this.fetch();

    return this.cache.id!;
  }

  async getDateJoined(): Promise<Date> {
    if (this.cache.history === undefined) await this.fetch();

    return new Date(this.cache.history!.joined);
  }

  async isScratchTeam(): Promise<boolean> {
    if (this.cache.scratchteam === undefined) await this.fetch();

    return this.cache.scratchteam!;
  }

  async getProfileId(): Promise<number> {
    if (this.cache.profile === undefined) await this.fetch();

    return this.cache.profile!.id;
  }

  async getIconUrl(size: number): Promise<string> {
    if (this.cache.id === undefined) await this.fetch();

    return `https://cdn2.scratch.mit.edu/get_image/user/${this.cache.id}_${size}x${size}.png`;
  }

  async getProfileStatus(): Promise<string> {
    if (this.cache.profile === undefined) await this.fetch();

    return this.cache.profile!.status;
  }

  async getProfileBio(): Promise<string> {
    if (this.cache.profile === undefined) await this.fetch();

    return this.cache.profile!.bio;
  }

  async getProfileCountry(): Promise<string> {
    if (this.cache.profile === undefined) await this.fetch();

    return this.cache.profile!.country;
  }

  projects(): ProjectStore { return new ProjectStore(this.client, this) }
  favorites(): FavoriteStore { return new FavoriteStore(this.client, this) }
}
