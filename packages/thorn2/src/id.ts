const digit = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const toB64 = (x: number) => x.toString(2).split(/(?=(?:.{6})+(?!.))/g).map(v => digit[parseInt(v, 2)]).join("")
const fromB64 = (x: string) => x.split("").reduce((s, v, i) => s = s * 64 + digit.indexOf(v), 0)

export class ID {
  protected index = 0;

  generate() {
    return toB64(this.index++);
  }
}

export const listNames = new ID();
export const variableNames = new ID();
export const functionProccodeIds = new ID();
export const functionReferenceIds = new ID();
