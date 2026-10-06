/** Least-recently-used cache of audio clips, bounded by total size. */
export class AudioCache {
  private readonly clips = new Map<string, Buffer>();
  private totalBytes = 0;

  constructor(private readonly maxBytes: number) {}

  get(key: string): Buffer | undefined {
    const clip = this.clips.get(key);
    if (clip) {
      // Re-inserting moves the clip to the newest end of the Map's insertion order.
      this.clips.delete(key);
      this.clips.set(key, clip);
    }

    return clip;
  }

  set(key: string, clip: Buffer): void {
    if (clip.byteLength > this.maxBytes) {
      return;
    }

    this.delete(key);
    this.clips.set(key, clip);
    this.totalBytes += clip.byteLength;

    for (const oldestKey of this.clips.keys()) {
      if (this.totalBytes <= this.maxBytes) {
        break;
      }
      this.delete(oldestKey);
    }
  }

  get size(): number {
    return this.clips.size;
  }

  private delete(key: string): void {
    const clip = this.clips.get(key);
    if (clip) {
      this.totalBytes -= clip.byteLength;
      this.clips.delete(key);
    }
  }
}
