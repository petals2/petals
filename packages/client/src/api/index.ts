export * from "./api";
export * from "./interfaces";

import { HttpMethod } from "undici/types/dispatcher";
import { Cookie, CookieJar } from "tough-cookie";
import { LoginResponse } from "./interfaces/login";
import { request } from "undici";
import { Session } from "./interfaces/session";
import { Message } from "./interfaces/message";
import { OldProject, Project } from "./interfaces/project";
import { User } from "./interfaces/user";
import { OldStudio, Studio } from "./interfaces/studios";
import { News } from "./interfaces/news";
import type { Project as PetalsProject, SerializedProject } from "petals-stem"
import type { Comment } from "./interfaces/comment";

export enum SortFormat {
  Ascending,
  Descending,
}

export class Requestor {
  protected token: string | undefined;

  static async build(): Promise<Requestor> {
    const response = await request("https://scratch.mit.edu/csrf_token/");
    const setCookies = response.headers["set-cookie"];

    let cookies: Cookie[];

    if (setCookies instanceof Array) {
      cookies = setCookies.map(cookie => Cookie.parse(cookie)).filter(c => c) as Cookie[];
    } else if (setCookies !== undefined) {
      const cookie = Cookie.parse(setCookies);

      cookies = cookie ? [cookie] : [];
    } else {
      cookies = [];
    }

    return new this(cookies);
  }

  protected readonly jar: CookieJar = new CookieJar();

  private constructor(cookies: Cookie[]) {
    for (const cookie of cookies) {
      this.jar.setCookieSync(cookie, "https://scratch.mit.edu");
    }
  }

  async makeBinaryRequest(method: HttpMethod, url: string, body?: any): Promise<Buffer> {
    console.log(`${method.toUpperCase()} ${url}`)

    const headers: Record<string, string> = {
      cookie: this.jar.getCookieStringSync(url),
      referer: "https://scratch.mit.edu/",
      "X-Requested-With": "XMLHttpRequest",
    }

    const cookies = this.jar.getCookiesSync(url);

    for (const cookie of cookies) {
      if (cookie.key === "scratchcsrftoken") {
        headers["x-csrftoken"] = cookie.value;
      }
    }

    if (this.token) {
      headers["x-token"] = this.token;
    }

    const response = await request(url, {
      method,
      body: Buffer.isBuffer(body) ? body : JSON.stringify(body),
      headers,
    });

    const setCookies = response.headers["set-cookie"];

    if (setCookies instanceof Array) {
      setCookies.forEach(cookie => {
        this.jar.setCookieSync(cookie,  url);
      })
    } else if (setCookies !== undefined) {
      this.jar.setCookieSync(setCookies, url);
    }

    return Buffer.from(await response.body.arrayBuffer());
  }

  async makeRequest<T>(method: HttpMethod, url: string, body?: any): Promise<T> {
    return JSON.parse((await this.makeBinaryRequest(method, url, body)).toString());
  }

  getCookieJar(): CookieJar { return this.jar }

  async login(username: string, password: string): Promise<LoginResponse[]> {
    const res = await this.makeRequest<LoginResponse[]>("POST", "https://scratch.mit.edu/accounts/login/", { username, password, useMessages: true });

    if (res instanceof Array) {
      const u = res.find(u => u.username === username);

      if (u?.success) this.token = u.token;
    }

    return res;
  }

  async getSession(): Promise<Session> {
    return await this.makeRequest<Session>("GET", "https://scratch.mit.edu/session/");
  }

  async getMessageCount(username: string): Promise<number> {
    return (await this.makeRequest<{ count: number }>("GET", "https://scratch.mit.edu/users/" + username + "/messages/count/")).count;
  }

  async getMessages(user: string, limit: number, offset: number, filter?: "comments" | "projects" | "studios" | "forums"): Promise<Message[] | { code: string, message: string }> {
    return await this.makeRequest<Message[]>("GET", `https://api.scratch.mit.edu/users/${user}/messages?limit=${limit}&offset=${offset}&filter=${filter ?? ""}`);
  }

  async clearMessage(): Promise<void> {
    await this.makeRequest("POST", "https://scratch.mit.edu/site-api/messages/messages-clear/");
  }

  async getProject(id: number): Promise<Project | { code: string, message: string }> {
    return await this.makeRequest<Project | { code: string, message: string }>("GET", `https://api.scratch.mit.edu/projects/${id}/`);
  }

  async getUserByUsername(username: string): Promise<User | { code: string, message: string }> {
    return await this.makeRequest<User>("GET", "https://api.scratch.mit.edu/users/" + username + "/");
  }

  async getStudio(id: number): Promise<Studio | { code: string, message: string }> {
    return await this.makeRequest<Studio>("GET", "https://api.scratch.mit.edu/studios/" + id + "/");
  }

  async exploreProjects(limit: number, offset: number, language: string, mode: "trending" | "popular" | "recent" = "trending", query: "*" | "animations" | "art" | "games" | "music" | "stories" | "tutorial" = "*"): Promise<Project[] | { code: string, message: string }> {
    return await this.makeRequest<Project[] | { code: string, message: string }>("GET", `https://api.scratch.mit.edu/explore/projects?limit=${limit}&offset=${offset}&language=${language}&mode=${mode}&q=${query}`);
  }

  async exploreStudios(limit: number, offset: number, language: string, mode: "trending" | "popular" | "recent" = "trending", query: "*" | "animations" | "art" | "games" | "music" | "stories" | "tutorial" = "*"): Promise<Studio[] | { code: string, message: string }> {
    return await this.makeRequest<Studio[] | { code: string, message: string }>("GET", `https://api.scratch.mit.edu/explore/studios?limit=${limit}&offset=${offset}&language=${language}&mode=${mode}&q=${query}`);
  }

  async searchProjects(limit: number, offset: number, query: string, language: string, mode: "trending" | "popular" = "popular"): Promise<Project[] | { code: string, message: string }> {
    return await this.makeRequest<Project[] | { code: string, message: string }>("GET", `https://api.scratch.mit.edu/search/projects?limit=${limit}&offset=${offset}&language=${language}&mode=${mode}&q=${query}`);
  }

  async searchStudios(limit: number, offset: number, query: string, language: string, mode: "trending" | "popular" = "popular"): Promise<Studio[] | { code: string, message: string }> {
    return await this.makeRequest<Studio[] | { code: string, message: string }>("GET", `https://api.scratch.mit.edu/search/studios?limit=${limit}&offset=${offset}&language=${language}&mode=${mode}&q=${query}`);
  }

  async getNews(limit: number, offset: number): Promise<News[]> {
    return await this.makeRequest<News[]>("GET", `https://api.scratch.mit.edu/news?limit=${limit}&offset=${offset}`);
  }

  async isValidUsername(username: string): Promise<string | undefined> {
    const v = await this.makeRequest<[{ username: string, msg: string }]>("GET", `https://scratch.mit.edu/accounts/check_username/${username}/`);

    for (const check of v) {
      if (check.username === username) return check.msg;
    }

    return undefined;
  }

  async getOwnProjects(page: number = 1, filter: "all" | "shared" | "notshared" | "trashed" = "all", sortKind?: "title" | "view_count" | "love_count" | "remixers_count", sortFormat: SortFormat = SortFormat.Descending): Promise<OldProject[]> {
    const ascsort = sortFormat === SortFormat.Ascending ? (sortKind ?? "") : "";
    const descsort = sortFormat === SortFormat.Descending ? (sortKind ?? "") : "";

    return await this.makeRequest<OldProject[]>("GET", `https://scratch.mit.edu/site-api/projects/${filter}/?page=${page}&ascsort=${ascsort}&descsort=${descsort}`);
  }

  async getOwnStudios(page: number = 1, filter: "all" | "owned" = "all", sortKind?: "title" | "projectors_count", sortFormat: SortFormat = SortFormat.Descending) {
    const ascsort = sortFormat === SortFormat.Ascending ? (sortKind ?? "") : "";
    const descsort = sortFormat === SortFormat.Descending ? (sortKind ?? "") : "";

    return await this.makeRequest<OldStudio[]>("GET", `https://scratch.mit.edu/site-api/galleries/${filter}/?page=${page}&ascsort=${ascsort}&descsort=${descsort}`);
  }

  async postComment(projectId: number, content: string, parentComment: { id: number, authorId: number } | undefined): Promise<Comment> {
    return await this.makeRequest<Comment>("POST", `https://api.scratch.mit.edu/proxy/comments/project/${projectId}/`, { content, parent_id: parentComment?.id ?? "", commentee_id: parentComment?.authorId ?? "" });
  }

  async likeProject(projectId: number, ownUsername: string): Promise<{ projectId: string, statusChanged: boolean, userLove: boolean }> {
    return await this.makeRequest<{ projectId: string, statusChanged: boolean, userLove: boolean }>("POST", `https://api.scratch.mit.edu/proxy/project/${projectId}/loves/user/${ownUsername}/`);
  }

  async unlikeProject(projectId: number, ownUsername: string): Promise<{ projectId: string, statusChanged: boolean, userLove: boolean }> {
    return await this.makeRequest<{ projectId: string, statusChanged: boolean, userLove: boolean }>("DELETE", `https://api.scratch.mit.edu/proxy/project/${projectId}/loves/user/${ownUsername}/`);
  }

  async hasLikedProject(projectId: number, ownUsername: string): Promise<boolean> {
    return (await this.makeRequest<{ userLove: boolean }>("GET", `https://api.scratch.mit.edu/project/${projectId}/loves/user/${ownUsername}/`)).userLove;
  }

  async favoriteProject(projectId: number, ownUsername: string): Promise<{ projectId: string, statusChanged: boolean, userFavorite: boolean }> {
    return await this.makeRequest<{ projectId: string, statusChanged: boolean, userFavorite: boolean }>("POST", `https://api.scratch.mit.edu/proxy/project/${projectId}/favorites/user/${ownUsername}/`);
  }

  async unfavoriteProject(projectId: number, ownUsername: string): Promise<{ projectId: string, statusChanged: boolean, userFavorite: boolean }> {
    return await this.makeRequest<{ projectId: string, statusChanged: boolean, userFavorite: boolean }>("DELETE", `https://api.scratch.mit.edu/proxy/project/${projectId}/favorites/user/${ownUsername}/`);
  }

  async hasFavoritedProject(projectId: number, ownUsername: string): Promise<boolean> {
    return (await this.makeRequest<{ userFavorite: boolean }>("GET", `https://api.scratch.mit.edu/project/${projectId}/favorites/user/${ownUsername}/`)).userFavorite;
  }

  async createProject(project: PetalsProject | SerializedProject): Promise<{ status: string, "content-title": string, "content-name": string, "autosave-interval": string }> {
    return await this.makeRequest<{ status: string, "content-title": string, "content-name": string, "autosave-interval": string }>("POST", "https://projects.scratch.mit.edu/", "serialize" in project ? project.serialize() : project);
  }

  async setProjectThumbnail(projectId: number, payload: Buffer): Promise<{ "autosave-internal": string, "content-length": number, "content-name": string, "result-code": number, status: string }> {
    return await this.makeRequest<{ "autosave-internal": string, "content-length": number, "content-name": string, "result-code": number, status: string }>("POST", `https://scratch.mit.edu/internalapi/project/thumbnail/${projectId}/set/`, payload);
  }

  async getProjectRemixes(projectId: number, limit: number, offset: number): Promise<Project[]> {
    return await this.makeRequest<Project[]>("GET", `https://api.scratch.mit.edu/projects/${projectId}/remixes/?limit=${limit}&offset=${offset}`);
  }

  async getProjectComments(projectId: number, projectAuthor: string, limit: number, offset: number): Promise<Comment[]> {
    return await this.makeRequest<Comment[]>("GET", `https://api.scratch.mit.edu/users/${projectAuthor}/projects/${projectId}/comments?offset=${offset}&limit=${limit}`);
  }

  async getProjectComment(projectId: number, projectAuthor: string, comment: string): Promise<Comment> {
    return await this.makeRequest<Comment>("GET", `https://api.scratch.mit.edu/users/${projectAuthor}/projects/${projectId}/comments/${comment}/`);
  }

  async deleteProjectComment(projectId: number, commentId: number): Promise<{} | { code: string, message: string }> {
    return await this.makeRequest<{}>("DELETE", `https://api.scratch.mit.edu/proxy/comments/project/${projectId}/comment/${commentId}/`);
  }

  async getProjectCommentReplies(projectId: number, projectAuthor: string, comment: string, limit: number, offset: number): Promise<Comment[]> {
    return await this.makeRequest<Comment[]>("GET", `https://api.scratch.mit.edu/users/${projectAuthor}/projects/${projectId}/comments/${comment}/replies?offset=${offset}&limit=${limit}`);
  }

  async getProjectStudios(projectId: number, projectAuthor: string, limit: number, offset: number): Promise<Studio[]> {
    return await this.makeRequest<Studio[]>("GET", `https://api.scratch.mit.edu/users/${projectAuthor}/projects/${projectId}/studios?offset=${offset}&limit=${limit}`);
  }

  async getProjectVisibility(projectId: number, projectAuthor: string): Promise<{ censored: boolean, censoredByAdmin: boolean, censoredByCommunity: boolean, creatorId: number, deleted: boolean, message: string, projectId: number, reshareable: boolean }> {
    return await this.makeRequest<{
      censored: boolean,
      censoredByAdmin: boolean,
      censoredByCommunity: boolean,
      creatorId: number,
      deleted: boolean,
      message: string,
      projectId: number,
      reshareable: boolean
    }>("GET", `https://api.scratch.mit.edu/users/${projectAuthor}/projects/${projectId}/visibility/`);
  }

  async getUserProjects(username: string, limit: number, offset: number): Promise<Project[]> {
    return await this.makeRequest<Project[]>("GET", `https://api.scratch.mit.edu/users/${username}/projects/?limit=${limit}&offset=${offset}`);
  }

  async getUserFavorites(username: string, limit: number, offset: number): Promise<Project[]> {
    return await this.makeRequest<Project[]>("GET", `https://api.scratch.mit.edu/users/${username}/favorites/?limit=${limit}&offset=${offset}`);
  }

  async getUserFollowers(username: string, limit: number, offset: number): Promise<User[]> {
    return await this.makeRequest<User[]>("GET", `https://api.scratch.mit.edu/users/${username}/followers/?limit=${limit}&offset=${offset}`);
  }

  async getUserFollowing(username: string, limit: number, offset: number): Promise<User[]> {
    return await this.makeRequest<User[]>("GET", `https://api.scratch.mit.edu/users/${username}/following/?limit=${limit}&offset=${offset}`);
  }

  async getProjectContents(projectId: number): Promise<Buffer> {
    return await this.makeBinaryRequest("GET", `https://projects.scratch.mit.edu/${projectId}`);
  }

  async getProjectFile(hashWExt: string): Promise<Buffer> {
    const response = await request(`https://assets.scratch.mit.edu/internalapi/asset/${hashWExt}/get/`);
    return Buffer.from(await response.body.arrayBuffer());
  }
}
