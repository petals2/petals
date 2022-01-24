import { SerializedSound, Sound } from ".";

export type SerializedSoundStore = SerializedSound[];

export class SoundStore {
  private sounds: Sound[] = [];

  static fromJson(json: SerializedSoundStore) {
    const soundStore = new SoundStore();
    soundStore.deserialize(json);
    return soundStore;
  }

  deserialize(json: SerializedSoundStore) {
    this.sounds = json.map(sound => Sound.fromJson(sound));
  }

  serialize(): SerializedSoundStore {
    return this.sounds.map(sound => sound.serialize());
  }

  addSound(sound: Sound): void {
    this.sounds.push(sound);
  }

  getSounds(): Sound[] {
    return this.sounds;
  }

  findSound(hash: string): Sound | undefined {
    return this.sounds.find(sound => sound.getMd5Hash() === hash);
  }

  getSound(hash: string): Sound {
    const result = this.findSound(hash);

    if (result === undefined)
      throw new Error("Failed to find sound by hash: " + hash);

    return result;
  }

  findSoundByName(name: string): Sound | undefined {
    return this.sounds.find(sound => sound.getName() === name);
  }

  getSoundByName(name: string): Sound {
    const result = this.findSoundByName(name);

    if (result === undefined)
      throw new Error("Failed to find sound by name: " + name);

    return result;
  }

  removeSound(sound: Sound): void {
    this.removeSoundByHash(sound.getMd5Hash());
  }

  removeSoundByHash(hash: string): void {
    const index = this.sounds.findIndex(s => s.getMd5Hash() === hash);

    if (index === -1)
      throw new Error("Failed to find sound by hash: " + hash);

    this.sounds.splice(index, 1);
  }
}
