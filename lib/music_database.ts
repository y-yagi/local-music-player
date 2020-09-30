import Dexie from "dexie";
import MusicType from "../types/music";

export default class MusicDatabase extends Dexie {
  public musics: Dexie.Table<MusicType, number>;

  public constructor() {
    super("MusicDatabase");
    this.version(1).stores({
      musics: "++id,name,file",
    });
    this.musics = this.table("musics");
  }
}
