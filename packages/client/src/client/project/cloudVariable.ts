import { CloudSession } from "./cloudSession";

export class CloudVariable {
  protected value: string | number;
  protected listeners: ((val: number | string) => void)[] = [];

  constructor(protected readonly session: CloudSession, protected readonly name: string, initialValue: string | number) {
    this.value = initialValue;
  }

  set(val: number | string): void {
    this.session.sendPacket("set", { name: this.name, value: val });
  }

  get(): number | string {
    return this.value;
  }

  private setValue(val: number | string): void {
    this.value = val;

    this.listeners.forEach(l => l(val));
  }

  addUpdateListener(listener: (val: number | string) => void) {
    this.listeners.push(listener);
  }

  removeUpdateListener(listener: (val: number | string) => void) {
    const v = this.listeners.indexOf(listener);

    if (v !== -1) {
      this.listeners.splice(v, 1);
    }
  }
}
