import { SiteProject } from ".";
import { Client } from "..";
import WebSocket from "ws";
import { Project } from "petals-stem";
import { CloudVariable } from "./cloudVariable";

export class CloudSession {
  protected socket: WebSocket | undefined;
  protected variables: Map<string, CloudVariable> = new Map();
  protected targetSizeToRes: number = Infinity;
  protected res: any;

  constructor(protected readonly client: Client, protected readonly project: SiteProject) {  }

  async sendPacket(method: string, options: any = {}): Promise<void> {
    const data = {
      user: await this.client.user().getUsername(),
      project_id: await this.project.getId(),
      method,
      ...options,
    }

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data) + "\n");
    } else {
      throw new Error("Failed to send packet to non-ready socket, " + this.socket?.readyState);
    }
  }

  connect(): Promise<void> {
    return new Promise<void>((res, rej) => {
      this.socket = new WebSocket("wss://clouddata.scratch.mit.edu/", {
        headers: {
          cookie: this.client.getRequestor().getCookieJar().getCookieStringSync("wss://clouddata.scratch.mit.edu/"),
          origin: "https://scratch.mit.edu",
        }
      });

      this.socket.on("open", async () => {
        const project = await Project.fromReference(this.project)

        const cvar = project.getTargets().getTargets().map(target => target.getVariables().getCloudVariables()).flat();

        this.targetSizeToRes = cvar.length;
        this.res = res;

        this.sendPacket("handshake");
      })

      this.socket.on("close", rej);

      this.socket.on("message", d => {
        const x = d.toString().split("\n").filter(e => e);
        x.forEach(n => {
          const v = JSON.parse(n);

          switch (v.method) {
            case "set": this.getOrCreateVariable(v.name, v.value);
          }
        })
      });
    })
  }

  destroy() {
    this.socket?.close();
  }

  private getOrCreateVariable(name: string, value: number | string): CloudVariable {
    if (!this.variables.has(name)) {
      this.variables.set(name, new CloudVariable(this, name, value));

      if (this.variables.size >= this.targetSizeToRes) {
        this.res();
      }
    }

    const x = this.variables.get(name)!;

    (x as any).setValue(value);

    return x;
  }

  getVariable(name: string): CloudVariable | undefined {
    if (this.variables.has(name)) return this.variables.get(name)!;

    return this.variables.get("☁ " + name);
  }
}
