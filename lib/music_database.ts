import Dexie from "dexie";

interface Music {
  id?: number;
  name?: string;
  file?: File;
}

export default class MusicDatabase extends Dexie {
  public musics: Dexie.Table<Music, number>;

  public constructor() {
    super("MusicDatabase");
    this.version(1).stores({
      musics: "++id,name,file",
    });
    this.musics = this.table("musics");
  }
}
