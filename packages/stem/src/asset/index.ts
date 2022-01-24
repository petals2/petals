import crypto from "node:crypto";

export type SerializedAsset = {
  assetId: string;
  name: string;
  md5ext: string;
  dataFormat: string;
}

export class Asset {
  private hashCache: string;

  constructor(
    private readonly name: string,
    private readonly dataFormat: string,
    private readonly data: Buffer,
  ) {
    this.hashCache = crypto.createHash("md5").update(this.data).digest("hex");
  }

  getMd5Hash(): string {
    return this.hashCache;
  }

  getName(): string {
    return this.name;
  }

  getDataFormat(): string {
    return this.dataFormat;
  }

  getData(): Buffer {
    return this.data;
  }

  serialize(): SerializedAsset {
    return {
      assetId: this.getMd5Hash(),
      name: this.getName(),
      md5ext: this.getMd5Hash() + "." + this.getDataFormat(),
      dataFormat: this.getDataFormat(),
    };
  }
}
