import { WaveFileParser } from "wavefile-parser";
import { fromBuffer } from "file-type";
import { Asset } from "../asset";
import { Project } from "..";
import { ProjectReference } from "../project/projectReference";

export type SerializedSound = {
  // asset generic
  assetId: string;
  name: string;
  md5ext: string;
  dataFormat: string;

  // sound specific
  rate: number;
  sampleCount: number;
}

// GRRR
const mp3Parser: any = (require as any)("mp3-parser");

export class Sound extends Asset {
  protected sampleRate: number;
  protected sampleCount: number;

  static async fromReference(project: Project, reference: ProjectReference, json: SerializedSound) {
    const el = await reference.getAsset(json.md5ext);

    if (el === undefined) throw new Error("Missing asset: " + json.md5ext);

    const sound = new Sound(json.name, json.dataFormat as "mp3"|"wav", el);
    return sound;
  }

  static async fromBuffer(name: string, buffer: Buffer): Promise<Sound> {
    const fileType = await fromBuffer(buffer);

    if (fileType === undefined) throw new Error("Failed to infer file type from buffer");

    const { ext } = fileType;

    if (ext !== "mp3" && ext !== "wav") {
      throw new Error("Invalid audio file passed, only mp3 and wav are supported");
    }

    return new Sound( name, ext, buffer );
  }

  constructor(
    name: string,
    dataFormat: "mp3" | "wav",
    data: Buffer,
  )
  constructor(
    name: string,
    dataFormat: "mp3" | "wav",
    data: Buffer,
    sampleRate: number,
    sampleCount: number,
  )
  constructor(
    name: string,
    dataFormat: "mp3" | "wav",
    data: Buffer,
    sampleRate?: number,
    sampleCount?: number,
  ) {
    super(name, dataFormat, data);

    // this shit kinda scuffed. maybe re-work?

    if (sampleRate === undefined || sampleCount === undefined) {
      if (dataFormat === "wav") {
        const wav: any = new WaveFileParser(data);
        this.sampleRate = sampleRate ?? wav.fmt.sampleRate;
        const bytesPerSample = wav.fmt.bitsPerSample / 8;
        this.sampleCount = sampleCount ?? (wav.data.chunkSize / bytesPerSample);
      } else if (dataFormat === "mp3") {
        const dv = new DataView(data.buffer);

        let frames = mp3Parser.readTags(dv);
        let shouldContinue = true;

        this.sampleRate = sampleRate ?? frames[1].header.samplingRate;

        if (sampleCount === undefined) {
          while (shouldContinue) {
            const arr = mp3Parser.readTags(dv, frames[frames.length - 1]._section.nextFrameIndex);
            shouldContinue = arr.length > 0;
            frames.push(...arr);
          }
  
          this.sampleCount = frames.reduce((c: number, n: any) => { c += n._section.sampleLength ?? 0; return c }, 0);
        } else {
          this.sampleCount = sampleCount;
        }
      } else {
        throw new Error("Unknown data format " + dataFormat);
      }
    } else {
      this.sampleCount = sampleCount;
      this.sampleRate = sampleRate;
    }
  }

  getSampleRate(): number {
    return this.sampleRate;
  }

  getSampleCount(): number {
    return this.sampleCount;
  }

  getDuration(): number {
    return this.sampleCount / this.sampleRate;
  }

  getDurationInSeconds(): number {
    return this.getDuration() / 1000;
  }

  protected async deserialize(json: SerializedSound) {
    
  }

  serialize(): SerializedSound {
    return {
      ...super.serialize(),
      rate: this.sampleRate,
      sampleCount: this.sampleCount,
    };
  }
}
