import { Requestor } from "../api"
import { LoggedInSession, Session } from "../api/interfaces/session";
import { MessageStore } from "./message/store";
import { NewsStore } from "./news/store";
import { SiteProject } from "./project";
import { User } from "./user";
import { ClientUser } from "./user/client";

export class Client {
  static async login(username: string, password: string): Promise<Client> {
    const requestor = await Requestor.build();

    await requestor.login(username, password);

    const session = await requestor.getSession();

    if (!("user" in session)) {
      throw new Error("Session result was a LoggedOutSession, expected a LoggedInSession");
    }

    return new Client(requestor, session);
  }

  constructor(private readonly requestor: Requestor, private session: LoggedInSession) {}

  async refreshSession(): Promise<LoggedInSession> {
    const session = await this.requestor.getSession();

    if (!("user" in session)) {
      throw new Error("Session result was a LoggedOutSession, expected a LoggedInSession");
    }

    return this.session = session;
  }

  getRequestor() { return this.requestor }

  getIconUrl(size: number = 8192): string { return `https://cdn2.scratch.mit.edu/get_image/user/${this.session.user.id}_${size}x${size}.png` }
  getDateJoined(): Date { return new Date(this.session.user.dateJoined + ".000Z") }
  getUsername(): string { return this.session.user.username }
  isBanned(): boolean { return this.session.user.banned }
  getToken(): string { return this.session.user.token }
  getEmail(): string { return this.session.user.email }
  getId(): number { return this.session.user.id }

  isAdmin(): boolean { return this.session.permissions.admin }
  isEducator(): boolean { return this.session.permissions.educator }
  isEducatorInvitee(): boolean { return this.session.permissions.educator_invitee }
  isInvitedScratcher(): boolean { return this.session.permissions.invited_scratcher }
  isNewScratcher(): boolean { return this.session.permissions.new_scratcher }
  isScratcher(): boolean { return this.session.permissions.scratcher }
  isSocial(): boolean { return this.session.permissions.social }
  isStudent(): boolean { return this.session.permissions.student }

  hasFlag(flag: keyof LoggedInSession["flags"]): boolean { return this.session.flags[flag] }

  messages(): MessageStore { return new MessageStore(this) }
  news(): NewsStore { return new NewsStore(this) }
  user(): ClientUser { return new ClientUser(this, { username: this.getUsername(), id: this.getId(), history: { joined: this.session.user.dateJoined + ".000Z" } }, { token: this.getToken(), email: this.getEmail(), banned: this.isBanned() })}

  async findUser(username: string): Promise<User | undefined> {
    const c = await this.requestor.getUserByUsername(username);

    if ("code" in c) return undefined;

    return new User(this, c);
  }

  async findProject(id: number): Promise<SiteProject | undefined> {
    const c = await this.requestor.getProject(id);

    if ("code" in c) return undefined;

    return new SiteProject(this, c);
  }
}
